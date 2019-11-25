export const id = x => x
export const idKey = ([key]) => key
export const sortKey = ([a], [b]) => a > b

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

export const typeOf = getTypeName

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

export function drain(queue) {
    let values = []
    let fails = []

    while (queue.length > 0) {
        const { type, input, path, validator, ...rest } = queue.shift()

        switch (type) {
            case 'schedule':
                const result = validator(input, path)

                queue.push(...result)
                break
            case 'value':
                values.push({ type, input, path, ...rest })
                break
            case 'fail':
                fails.push({ path, ...rest })
                break
        }
    }

    return [values, fails]
}

export function schedule(path, input, validator) {
    return { type: 'schedule', validator, path, input }
}

export function value(path, input) {
    return { type: 'value', path, input }
}

export function fail(path, message, extra) {
    return { type: 'fail', path, message, extra }
}
