import {
    TYPE,
    drain,
    value,
    fail,
    schedule,
    listDifference,
    listUnion,
    getTypeName,
    sortKey,
    idKey
} from './util'

export function object(shape) {
    const shapeEntries = Object.entries(shape).sort(sortKey)

    return (input, path) => {
        if (!TYPE.object(input)) {
            return [fail(path, `not an object`, getTypeName(input))]
        }

        const entries = Object.entries(input).sort(sortKey)

        const missingEntries = listDifference(shapeEntries, entries, idKey)
        const extraneousEntries = listDifference(entries, shapeEntries, idKey)

        if (missingEntries.length > 0) {
            return [fail(path, `missing keys`, missingEntries.map(idKey))]
        }

        if (extraneousEntries.length > 0) {
            return [fail(path, `extraneous keys`, extraneousEntries.map(idKey))]
        }

        const [values, fails] = drain(
            listUnion(entries, shapeEntries, idKey).map(([key, value]) =>
                schedule([...path, key], value, shape[key])
            )
        )

        if (fails.length > 0) {
            return [fail(path, 'failed to validate object', fails)]
        } else {
            return [value(path, {}), ...values]
        }
    }
}
