import { listDifference, id, second, len, customFail } from './util'

export function union(...validators) {
    return (input, { fail, path }) => {
        let allValidators = Array.from(Array(len(validators)), second)

        const [failedValidators, extraErrors, failCustom] = customFail()

        for (let [i, validator] of validators.entries()) {
            validator(input, { fail: failCustom, path: [i] })
        }

        const notFailed = listDifference(allValidators, failedValidators, id)

        if (notFailed.length === 0) {
            fail(path, `no match found for union`, extraErrors)
        }
    }
}
