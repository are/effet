/**
 * This operator sets the input data for the effect to an arbitrary
 * value.
 *
 * @param  {any}
 * @return {Operator}
 */
export function source(input) {
    return {
        invariant(_, ctx) {
            if (input === undefined || input === null) {
                throw new Error('input cannot be undefined or null')
            }
        },

        async preprocess(data, ctx) {
            return input
        }
    }
}

export default source
