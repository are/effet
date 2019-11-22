export function validate(shape, input) {
    const errors = []

    const fail = (path, message, extra) => {
        errors.push({
            message,
            path,
            extra
        })
    }

    shape(input, { fail, path: [] })

    return errors
}

export function isValid(shape, input) {
    let errorCount = 0

    const fail = (path, message, extra) => {
        errorCount += 1
    }

    shape(input, { fail, path: [] })

    return errorCount === 1
}

export * from './list'
export * from './object'
export * from './union'
export * from './primitives'

export { getTypeName } from './util'
