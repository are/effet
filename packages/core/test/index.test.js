import { idEffect } from './mocks'

import { construct, Construct } from '../src/index'

import source from '../src/operators/source'

describe('construct function', () => {
    it('should return an instance of Construct', async () => {
        const instance = construct()

        expect(instance).to.be.an.instanceof(Construct)
    })
})

describe('Construct', () => {
    it('should pass an input to the output', async () => {
        const input = Symbol('input')
        const instance = construct(source(input), idEffect())

        const output = await instance.run({})

        expect(output).to.equal(input)
    })
})
