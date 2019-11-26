import { TYPE, fail, value, typeOf } from './util'

export function string(input, path) {
    if (!TYPE.string(input)) {
        return [fail(path, `not a string`, typeOf(input))]
    } else {
        return [value(path, input)]
    }
}

export function number(input, path) {
    if (!TYPE.number(input)) {
        return [fail(path, `not a number`, typeOf(input))]
    } else {
        return [value(path, input)]
    }
}

export function boolean(input, path) {
    if (!TYPE.boolean(input)) {
        return [fail(path, `not a boolean`, typeOf(input))]
    } else {
        return [value(path, input)]
    }
}

export function symbol(input, path) {
    if (!TYPE.symbol(input)) {
        return [fail(path, `not a symbol`, typeOf(input))]
    } else {
        return [value(path, input)]
    }
}

export function any(input, path) {
    if (TYPE.undef(input) || TYPE.nil(input)) {
        return [
            fail(
                path,
                `expected a value, instead got ${typeOf(input)}`,
                typeOf(input)
            )
        ]
    } else {
        return [value(path, input)]
    }
}
