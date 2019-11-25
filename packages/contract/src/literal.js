import { TYPE, fail, value } from './util'

export function literal(expected) {
    return (input, path) => {
        if (expected === input) {
            return [value(path, input)]
        } else {
            return [fail(path, 'cannot validate the literal', input)]
        }
    }
}
