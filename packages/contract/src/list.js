import { TYPE, schedule, value, fail, typeOf, drain } from './util'

export function list(validator) {
    return (input, path) => {
        if (!TYPE.list(input)) {
            return [fail(path, `not a list`, typeOf(input))]
        }

        let [values, errors] = input.reduce(
            ([values, errors], value, i) => {
                const [newValues, newErrors] = drain(
                    validator(value, [...path, i])
                )

                return [[...values, ...newValues], [...errors, ...newErrors]]
            },
            [[], []]
        )

        if (errors.length > 0) {
            return [fail(path, 'cannot validate the list', errors)]
        } else {
            return [value(path, []), ...values]
        }
    }
}
