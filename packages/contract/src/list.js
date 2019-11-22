import { listDifference, len, customFail, getTypeName, TYPE } from './util'

export function list(validator) {
    return (input, { fail, path }) => {
        const [fails, extraErrors, failCustom] = customFail()

        if (!TYPE.list(input)) {
            return fail(path, `not a list`, getTypeName(input))
        }

        for (let [i, entry] of input.entries()) {
            validator(entry, { fail: failCustom, path: [...path, i] })
        }

        if (len(fails)) {
            fail(path, `no match found for an element of the list`, extraErrors)
        }
    }
}
