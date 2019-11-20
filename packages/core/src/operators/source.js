export default source => ({
    invariant(_, ctx) {
        if (source === undefined || source === null) {
            throw new Error('Source cannot be undefined')
        }
    },

    async preprocess(data, ctx) {
        return source
    }
})
