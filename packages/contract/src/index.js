import { schedule, drain } from './util'

import op from 'object-path'

export function validate(shape, input) {
    let queue = [schedule([], input, shape)]

    const [values, errors] = drain(queue)
    let result = null

    for (let { path, input } of values) {
        if (path.length === 0) {
            result = input
        } else {
            op.set(result, [...path], input)
        }
    }

    return { value: result, errors }
}

export function getErrors(shape, input) {
    const { errors } = validate(shape, input)

    return errors
}

export function isValid(shape, input) {
    const { errors } = validate(shape, input)

    return errors.length === 0
}

export * from './list'
export * from './object'
export * from './union'
export * from './primitives'
export * from './maybe'
export * from './literal'

export { getTypeName } from './util'
