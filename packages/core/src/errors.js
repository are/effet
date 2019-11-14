class ConstructionError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class InvariantError extends ConstructionError {
    constructor(originalError) {
        super(`Invariant Violation: ${originalError.message}`)
        this.originalError = originalError
    }
}

export class StageError extends ConstructionError {
    constructor(stage, originalError) {
        super(`(${stage}) ${originalError.message}`)
        this.originalError = originalError
    }
}
