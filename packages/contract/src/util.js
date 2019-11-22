export const id = x => x
export const idKey = ([key]) => key
export const sortKey = ([a], [b]) => a > b

export const first = (...args) => args[0]
export const second = (...args) => args[1]
export const len = list => list.length

export const TYPE = {
    string: value => typeof value === 'string' || value instanceof String,
    number: value => Number.isFinite(value),
    boolean: value => typeof value === 'boolean',
    symbol: value => typeof value === 'symbol',
    fn: value => typeof value === 'function',
    nil: value => value === null,
    undef: value => value === undefined,
    date: value => value instanceof Date,
    list: value => Array.isArray(value),
    object: value =>
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof Date) &&
        !Array.isArray(value),
    nan: value => Number.isNaN(value)
}

export function getTypeName(value) {
    const [type] = Object.entries(TYPE).find(([key, predicate]) =>
        predicate(value)
    ) || ['unknown']

    return type
}

export function listDifference(as, bs, comparator) {
    return as.filter(
        a => bs.find(b => comparator(a) === comparator(b)) === undefined
    )
}

export function listUnion(as, bs, comparator) {
    return as.filter(
        a => bs.find(b => comparator(a) === comparator(b)) !== undefined
    )
}

export function customFail() {
    const fails = []
    const errors = []

    const fail = (path, message, extra) => {
        fails.push(path[len(path) - 1])
        errors.push({ path, message, extra })
    }

    return [fails, errors, fail]
}
