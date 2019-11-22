import { StageError } from './errors'

import { TYPE, Stage } from './Stage'

const NONE = Symbol('none')
const INPUT = Symbol('input')
const OUTPUT = Symbol('output')
const EFFECT_INPUT = Symbol('effect_input')
const EFFECT_OUTPUT = Symbol('effect_output')

const STAGES = [
    Stage.of(TYPE.NOTIFY, 'invariant', { input: NONE }),
    Stage.of(TYPE.TRANSFORM, 'preprocess', {
        input: INPUT,
        output: EFFECT_INPUT
    }),
    Stage.of(TYPE.NOTIFY, 'prepare', { input: EFFECT_INPUT }),
    Stage.of(TYPE.EFFECT, 'effect', {
        input: EFFECT_INPUT,
        output: EFFECT_OUTPUT,
        catchToOutput: true
    }),
    Stage.of(TYPE.TRANSFORM, 'postprocess', {
        input: EFFECT_OUTPUT,
        output: OUTPUT
    }),
    Stage.of(TYPE.NOTIFY, 'cleanup', { input: NONE })
]

/**
 * `construct` returns this instance for convinience.
 */
class Effect {
    /**
     * Creates a new effect chain (based on this one), but allows you to extend it
     * with additional operators.
     * @param  {...[Operator]} operators An array of operators to extend the chain.
     * @return {Effect}               New, separate instance of Effect.
     */
    extend(operators) {
        this.operators = [...this.operators, ...operators]
    }

    /**
     * Run specified transform stage.
     *
     * @private
     */
    async transformStage(stage, data, options) {
        const operators = this.operators.filter(
            operator => typeof operator[stage] === 'function'
        )

        let $result = data
        for (let operator of operators) {
            $result = await operator[stage]($result, options)
        }

        return $result
    }

    /**
     * Run specified notify stage.
     *
     * @private
     */
    async notifyStage(stage, data, options) {
        const operators = this.operators.filter(
            operator => typeof operator[stage] === 'function'
        )

        for (let operator of operators) {
            await operator[stage](data, options)
        }
    }

    /**
     * Run specified effect stage.
     *
     * @private
     */
    async effectStage(stage, data, options) {
        const operator = this.operators.reduce(
            (current, next) =>
                typeof next[stage] === 'function' ? next : current,
            null
        )

        return operator[stage](data, options)
    }

    async run(params) {
        const ctx = new Map()
        const options = { ctx, params }

        ctx.set(INPUT, null)
        ctx.set(OUTPUT, null)
        ctx.set(NONE, undefined)

        for (let stage of STAGES) {
            try {
                const input = stage.input ? ctx.get(stage.input) : null

                const result = await this[stage.getStage()](
                    stage.name,
                    input,
                    options
                )

                if (stage.output) {
                    ctx.set(stage.output, result)
                }
            } catch (error) {
                if (stage.catchToOutput === true) {
                    ctx.set(stage.output, error)
                } else {
                    throw new StageError(stage, error)
                }
            }
        }

        return ctx.get(OUTPUT)
    }
}

export { Effect }
