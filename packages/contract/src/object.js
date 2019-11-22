import {
    listDifference,
    listUnion,
    TYPE,
    getTypeName,
    sortKey,
    idKey
} from './util'

export function object(shape) {
    const shapeEntries = Object.entries(shape).sort(sortKey)

    return (input, { fail, path }) => {
        if (!TYPE.object(input)) {
            return fail(path, `not an object`, getTypeName(input))
        }

        const entries = Object.entries(input).sort(sortKey)

        const missingEntries = listDifference(shapeEntries, entries, idKey)
        const extraneousEntries = listDifference(entries, shapeEntries, idKey)

        if (missingEntries.length > 0) {
            fail(path, `missing keys`, missingEntries.map(idKey))
        }

        if (extraneousEntries.length > 0) {
            fail(path, `extraneous keys`, extraneousEntries.map(idKey))
        }

        for (let [key, value] of listUnion(entries, shapeEntries, idKey)) {
            shape[key](value, { fail, path: [...path, key] })
        }
    }
}
