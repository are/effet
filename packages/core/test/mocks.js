export const idEffect = spy =>
    new (class {
        async effect(input, ctx) {
            if (spy) spy(input)
            return input
        }
    })()
