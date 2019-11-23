import { TYPE, typeOf } from './util'

export function string(input, { fail, path }) {
    if (!TYPE.string(input)) {
        fail(path, `not a string`, typeOf(input))
    }
}

export function number(input, { fail, path }) {
    if (!TYPE.number(input)) {
        fail(path, `not a number`, typeOf(input))
    }
}

export function boolean(input, { fail, path }) {
    if (!TYPE.boolean(input)) {
        fail(path, `not a boolean`, typeOf(input))
    }
}

export function any(input, { fail, path }) {
    if (TYPE.undef(input) || TYPE.nil(input)) {
        fail(
            path,
            `expected a value, instead got ${typeOf(input)}`,
            typeOf(input)
        )
    }
}
