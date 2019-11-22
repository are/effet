import { validate, list, string, any, union, number } from '../src/index'

describe('list validator', () => {
    it('should fail when subvalidator fails for any element', () => {
        const shape = list(string)

        const input = ['valid', 'valid', 4]

        const result = validate(shape, input)

        expect(result).to.deep.equal([
            {
                message: 'no match found for an element of the list',
                path: [],
                extra: [{ path: [2], message: 'not a string', extra: 'number' }]
            }
        ])
    })

    it('should fail when input is not a list', () => {
        const shape = list(any)

        const input = null

        const result = validate(shape, input)

        expect(result).to.deep.equal([
            { message: 'not a list', path: [], extra: 'nil' }
        ])
    })

    it('should work with any validator', () => {
        const shape = list(any)

        const input = [0, '', false, {}, [], Symbol('symbol')]

        const result = validate(shape, input)

        expect(result).to.deep.equal([])
    })

    it('should work with union validator', () => {
        const shape = list(union(string, number))

        const validInput = ['a', 2, 'c', 4]
        const invalidInput = ['a', false, 'c', []]

        const validResult = validate(shape, validInput)
        const invalidResult = validate(shape, invalidInput)

        expect(validResult).to.deep.equal([])
        expect(invalidResult).to.deep.equal([
            {
                message: 'no match found for an element of the list',
                path: [],
                extra: [
                    {
                        path: [1],
                        message: 'no match found for union',
                        extra: [
                            {
                                path: [0],
                                message: 'not a string',
                                extra: 'boolean'
                            },
                            {
                                path: [1],
                                message: 'not a number',
                                extra: 'boolean'
                            }
                        ]
                    },
                    {
                        path: [3],
                        message: 'no match found for union',
                        extra: [
                            {
                                path: [0],
                                message: 'not a string',
                                extra: 'list'
                            },
                            {
                                path: [1],
                                message: 'not a number',
                                extra: 'list'
                            }
                        ]
                    }
                ]
            }
        ])
    })
})
