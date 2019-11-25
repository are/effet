import { getErrors, list, string, any, union, number } from '../src/index'

describe('list validator', () => {
    it('should fail when subvalidator fails for any element', () => {
        const shape = list(string)

        const input = ['valid', 'valid', 4]

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([
            {
                message: 'cannot validate the list',
                path: [],
                extra: [{ path: [2], message: 'not a string', extra: 'number' }]
            }
        ])
    })

    it('should fail when input is not a list', () => {
        const shape = list(any)

        const input = null

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([
            { message: 'not a list', path: [], extra: 'nil' }
        ])
    })

    it('should work with any validator', () => {
        const shape = list(any)

        const input = [0, '', false, {}, [], Symbol('symbol')]

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([])
    })

    it('should work with union validator', () => {
        const shape = list(union(string, number))

        const validInput = ['a', 2, 'c', 4]
        const invalidInput = ['a', false, 'c', []]

        const validResult = getErrors(shape, validInput)
        const invalidResult = getErrors(shape, invalidInput)

        expect(validResult).to.deep.equal([])
        expect(invalidResult).to.deep.equal([
            {
                path: [],
                message: 'cannot validate the list',
                extra: [
                    {
                        path: [1],
                        message: 'cannot validate the union',
                        extra: undefined
                    },
                    {
                        path: [3],
                        message: 'cannot validate the union',
                        extra: undefined
                    }
                ]
            }
        ])
    })
})
