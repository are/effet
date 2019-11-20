import { idEffect } from './mocks'

import { construct, Constructor } from '../src/index'

import source from '../src/operators/source'

describe('constructor function', () => {
    it('should return an instance of Constructor', async () => {
        const instance = construct()

        expect(instance).to.be.an.instanceof(Constructor)
    })
})

describe('Constructor', () => {
    it('should pass an input to the output', async () => {
        const input = Symbol('input')
        const instance = construct(source(input), idEffect())

        const output = await instance.run({})

        expect(output).to.equal(input)
    })
})
