import { InvariantError, StageError } from './errors'

class Stage {
    static TYPE = {
        NOTIFY: Symbol('Stage.type notify'),
        TRANSFORM: Symbol('Stage.type transform'),
        EFFECT: Symbol('Stage.type effect')
    }

    constructor(type, name, { input, output, catchToOutput } = {}) {
        this.type = type
        this.name = name

        this.input = input
        this.output = output
        this.catchToOutput = catchToOutput ?? false
    }

    get stage() {
        if (this.type === this.TYPE.NOTIFY) {
            return 'notifyStage'
        } else if (this.type === this.TYPE.TRANSFORM) {
            return 'transformStage'
        } else if (this.type === this.TYPE.EFFECT) {
            return 'effectStage'
        }
    }

    static of(type, name, opts) {
        return new Stage(type, name, opts)
    }
}

export class Constructor {
    constructor(operators) {
        this.operators = operators
    }

    extend(operators) {
        this.operators = [...this.operators, ...operators]
    }

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

    async notifyStage(stage, data, options) {
        const operators = this.operators.filter(
            operator => typeof operator[stage] === 'function'
        )

        for (let operator of operators) {
            await operator[stage](data, options)
        }
    }

    async reduceStage(stage, data, options) {
        const operator = this.operators.reduce(
            (current, next) =>
                typeof next[stage] === 'function' ? next : current,
            null
        )

        return operator[stage](data, options)
    }

    static NONE = Symbol('none')
    static INPUT = Symbol('input')
    static OUTPUT = Symbol('output')
    static EFFECT_INPUT = Symbol('eff_input')
    static EFFECT_OUTPUT = Symbol('eff_output')

    static STAGES = [
        Stage.of(Stage.TYPE.NOTIFY, 'invariant', { input: this.NONE }),
        Stage.of(Stage.TYPE.TRANSFORM, 'preprocess', {
            input: this.INPUT,
            output: this.EFFECT_INPUT
        }),
        Stage.of(Stage.TYPE.NOTIFY, 'prepare', { input: this.EFFECT_INPUT }),
        Stage.of(Stage.TYPE.REDUCE, 'effect', {
            input: this.EFFECT_INPUT,
            output: this.EFFECT_OUTPUT,
            catchToOutput: true
        }),
        Stage.of(Stage.TYPE.TRANSFORM, 'postprocess', {
            input: this.EFFECT_OUTPUT,
            output: this.OUTPUT
        }),
        Stage.of(Stage.TYPE.NOTIFY, 'cleanup', { input: this.NONE })
    ]

    async run(params) {
        const ctx = new Map()
        const options = { ctx, params }

        ctx.set(this.INPUT, null)
        ctx.set(this.OUTPUT, null)
        ctx.set(this.NONE, undefined)

        for (let stage of this.STAGES) {
            try {
                const input = stage.input ? ctx.get(stage.input) : null

                const result = await this[stage.stage](
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

        return ctx.get(this.OUTPUT)
    }
}
