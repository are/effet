class EffectError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class StageError extends EffectError {
    constructor(stage, originalError) {
        super(`(${stage}) ${originalError.message}`)
        this.originalError = originalError
    }
}
