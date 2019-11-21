export function comparePaths(as, bs) {
    if (!Array.isArray(as) || !Array.isArray(bs)) {
        return false
    }

    if (as.length < bs.length) {
        return false
    }

    return bs.every((b, ib) => b === as[ib])
}

export function filterProperties(inputKeys, data, pathPrefix = []) {
    if (typeof data !== 'object') {
        return data
    }

    const entries = Object.entries(data)
    const filterKeys = inputKeys.map(key => key.split('.'))

    return entries.reduce((acc, [key, value]) => {
        const keyPath = [...pathPrefix, key]

        if (filterKeys.some(filterKey => comparePaths(filterKey, keyPath))) {
            const filteredValue =
                typeof value === 'object'
                    ? filterProperties(inputKeys, value, [...pathPrefix, key])
                    : value

            return {
                ...acc,
                [key]: filteredValue
            }
        } else {
            return acc
        }
    }, {})
}

/**
 * Assuming the output is an object or an array of objects,
 * project filters the resulting properties based on the array of allowed keys.
 *
 * @param {[String]} keys An array of keys that will be present in the resulting
 * object.
 */
export function project(keys) {
    return {
        invariant(_, ctx) {
            if (!Array.isArray(keys)) {
                throw new Error('keys must be an array')
            }
        },
        async postprocess(input, ctx) {
            if (Array.isArray(input)) {
                return input.map(entry => filterProperties(keys, entry))
            }

            return filterProperties(keys, input)
        }
    }
}

export default project
