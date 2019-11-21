import { construct } from '../src/index'

export const idEffect = spy =>
    new (class {
        async effect(input, ctx) {
            if (spy) spy(input)
            return input
        }
    })()

export const makePostEffect = (input, ...ops) =>
    construct(
        {
            preprocess: async () => input
        },
        idEffect(),
        ...ops
    )
