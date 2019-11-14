import { InvariantError, StageError } from './errors'

class Constructor {
    constructor(operators) {
        this.operators = operators
    }

    extend(operators) {
        this.operators = [...this.operators, ...operators]
    }

    async transformPhase(phase, data, options) {
        const operators = this.operators.filter(
            operator => typeof operator[phase] === 'function'
        )

        let $result = data
        for (let operator of operators) {
            $result = await operator[phase]($result, options)
        }

        return $result
    }

    async notifyPhase(phase, data, options) {
        const operators = this.operators.filter(
            operator => typeof operator[phase] === 'function'
        )

        for (let operator of operators) {
            await operator[phase](data, options)
        }
    }

    async reducePhase(phase, data, options) {
        const operator = this.operators.reduce(
            (current, next) =>
                typeof next[phase] === 'function' ? next : current,
            null
        )

        return operator[phase](data, options)
    }

    async run(params) {
        const ctx = new Map()
        const options = { ctx, params }

        try {
            await this.notifyPhase('invariant', null, options)
        } catch (error) {
            throw new InvariantError(error)
        }

        let inputData
        try {
            inputData = await this.transformPhase('preprocess', null, options)
        } catch (error) {
            throw new StageError('preprocess', error)
        }

        try {
            await this.notifyPhase('prepare', inputData, options)
        } catch (error) {
            throw new StageError('prepare', error)
        }

        let result
        try {
            result = await this.reducePhase('effect', inputData, options)
        } catch (error) {
            ctx.set('hasErrored', true)
            result = error
        }

        let outputData
        try {
            outputData = await this.transformPhase(
                'postprocess',
                result,
                options
            )
        } catch (error) {
            throw new StageError('postprocess', error)
        }

        try {
            await this.notifyPhase(
                'cleanup',
                { input: inputData, output: outputData },
                options
            )
        } catch (error) {
            throw new StageError('cleanup', error)
        }

        return outputData
    }
}

export const construct = (...operators) => new Constructor(operators)
