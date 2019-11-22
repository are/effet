import { TYPE, getTypeName } from './util'

export function string(input, { fail, path }) {
    if (!TYPE.string(input)) {
        fail(path, `not a string`, getTypeName(input))
    }
}

export function number(input, { fail, path }) {
    if (!TYPE.number(input)) {
        fail(path, `not a number`, getTypeName(input))
    }
}

export function boolean(input, { fail, path }) {
    if (!TYPE.boolean(input)) {
        fail(path, `not a boolean`, getTypeName(input))
    }
}

export function any(input, { fail, path }) {
    if (TYPE.undef(input) || TYPE.nil(input)) {
        fail(path, `null or undefined is not any`, getTypeName(input))
    }
}
