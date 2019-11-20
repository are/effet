import { idEffect } from '../mocks'

import { construct } from '../../src/index'
import source from '../../src/operators/source'

describe('source operator', () => {
    it('should reject on invariant stage if no arguments passed', async () => {
        const instance = construct(source())

        try {
            await instance.run()

            expect.fail()
        } catch (error) {}
    })

    it('should pass the input to the effect', async () => {
        const spy = sinon.fake()
        const input = Symbol('input')
        const instance = construct(source(input), idEffect(spy))

        await instance.run()

        expect(spy).to.have.been.calledWith(input)
    })
})
