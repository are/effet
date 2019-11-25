import { TYPE, schedule, value } from './util'

export function maybe(validator) {
    return (input, path) => {
        if (!TYPE.nil(input) && !TYPE.undef(input)) {
            return [schedule(path, input, validator)]
        } else {
            return [value(path, input)]
        }
    }
}
