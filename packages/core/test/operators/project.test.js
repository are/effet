import { makePostEffect } from '../mocks'

import {
    project,
    comparePaths,
    filterProperties
} from '../../src/operators/project'

describe('project operator', () => {
    it('should project the properties from output object', async () => {
        const input = {
            foo: 42,
            bar: { baz: false, quux: { abc: 21, xyz: 58 } },
            quux: true
        }
        const chain = makePostEffect(
            input,
            project(['foo', 'bar.baz', 'bar.quux.xyz'])
        )

        const result = await chain.run({})

        expect(result).to.be.deep.equal({
            foo: 42,
            bar: {
                baz: false,
                quux: {
                    xyz: 58
                }
            }
        })
    })

    it('should project objects from an array output', async () => {
        const input = [{ foo: 42, bar: 10 }, { foo: 32, baz: 20 }]

        const chain = makePostEffect(input, project(['foo']))

        const result = await chain.run({})

        expect(result).to.be.deep.equal([{ foo: 42 }, { foo: 32 }])
    })

    it('should throw if keys is not an array', async () => {
        const chain = makePostEffect({}, project())

        try {
            await chain.run({})

            expect.fail()
        } catch (error) {}
    })
})

describe('filterProperties helper', () => {
    it('should strip entries from object if they are not in the allow list', () => {
        const input = { foo: 42, bar: 10 }
        const allowlist = ['foo']

        const result = filterProperties(allowlist, input)

        expect(result).to.be.deep.equal({
            foo: 42
        })
    })

    it('should work with dot separated keys for deep allow list', () => {
        const input = { foo: 5, bar: { baz: 10, quux: { xyz: 42, abc: 10 } } }
        const allowlist = ['bar.quux.xyz']

        const result = filterProperties(allowlist, input)

        expect(result).to.be.deep.equal({
            bar: {
                quux: { xyz: 42 }
            }
        })
    })

    it('should return immediately if data is not an object', () => {
        const input = Symbol('input')
        const allowlist = ['doesnt', 'matter']

        const result = filterProperties(allowlist, input)

        expect(result).to.equal(input)
    })
})

describe('comparePaths helper', () => {
    it('should return true if arrays are shallowly equal', () => {
        const xs = [1, 2, 3, false, 'string', 'foo', 0]
        const ys = [1, 2, 3, false, 'string', 'foo', 0]

        const result = comparePaths(xs, ys)

        expect(result).to.be.true
    })

    it('should return false if arrays are deeply equal', () => {
        const xs = [1, 2, [3]]
        const ys = [1, 2, [3]]

        const result = comparePaths(xs, ys)

        expect(result).to.be.false
    })

    it('should return true if part of the first path is matched', () => {
        const xs = ['foo', 'bar', 'baz']
        const ys = ['foo', 'bar']

        const result = comparePaths(xs, ys)

        expect(result).to.be.true
    })

    it('should return false if second path is more specific than the first one', () => {
        const xs = ['foo', 'bar']
        const ys = ['foo', 'bar', 'xyz']

        const result = comparePaths(xs, ys)

        expect(result).to.be.false
    })

    it('should return false if one of the paths is not an array', () => {
        const xs = ['foo', 'bar']
        const ys = {}

        const result = comparePaths(xs, ys)

        expect(result).to.be.false
    })
})
