import { TYPE } from './util'

// export function maybe(validator) {
//     return (input, { fail, path }) => {
//         if (!TYPE.nil(input) && !TYPE.undef(input)) {
//             validator(input, { fail, path })
//         }
//     }
// }

export function maybe(validator) {
    return (input, { fail, path }) => {
        if (!TYPE.nil(input) && !TYPE.undef(input)) {
            return [[validator, path]]
        }
    }
}
