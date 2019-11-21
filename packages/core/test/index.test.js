import { idEffect } from './mocks'

import { construct, Effect } from '../src/index'

import source from '../src/operators/source'

describe('construct function', () => {
    it('should return an instance of Effect', async () => {
        const instance = construct()

        expect(instance).to.be.an.instanceof(Effect)
    })
})

describe('Effect', () => {
    it('should pass an input to the output', async () => {
        const input = Symbol('input')
        const instance = construct(source(input), idEffect())

        const output = await instance.run({})

        expect(output).to.equal(input)
    })
})
