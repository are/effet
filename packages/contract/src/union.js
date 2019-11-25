import {
    drain,
    schedule,
    fail,
    value,
    listDifference,
    id,
    second,
    len,
    customFail
} from './util'

export function union(...validators) {
    return (input, path) => {
        for (let validator of validators) {
            const [values, errors] = drain(validator(input, path))

            if (errors.length === 0) {
                return [...values]
            }
        }

        return [fail(path, `cannot validate the union`)]
    }
}
