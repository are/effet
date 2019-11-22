import {
    validate,
    union,
    number,
    string,
    object,
    boolean,
    list
} from '../src/index.js'

describe('union validator', () => {
    it('should pass if any of the subvalidators pass', () => {
        const shape = union(number, string)
        const input = 42

        const result = validate(shape, input)

        expect(result).to.deep.equal([])
    })

    it('should fail if all of the subvalidators fail', () => {
        const shape = union(object({ value: number }), string, boolean)
        const input = null

        const result = validate(shape, input)

        expect(result).to.deep.equal([
            {
                message: 'no match found for union',
                path: [],
                extra: [
                    { path: [0], message: 'not an object', extra: 'nil' },
                    { path: [1], message: 'not a string', extra: 'nil' },
                    { path: [2], message: 'not a boolean', extra: 'nil' }
                ]
            }
        ])
    })

    it('should work with nested unions', () => {
        const shape = union(
            number,
            union(string, boolean, union(list(number), list(string)))
        )
        const validInput = ['2', 'foo', '45']
        const invalidInput = [false, true, 'e']

        const validResult = validate(shape, validInput)
        const invalidResult = validate(shape, invalidInput)

        expect(validResult).to.deep.equal([])
        expect(invalidResult).to.deep.equal([
            {
                message: 'no match found for union',
                path: [],
                extra: [
                    { path: [0], message: 'not a number', extra: 'list' },
                    {
                        path: [1],
                        message: 'no match found for union',
                        extra: [
                            {
                                path: [0],
                                message: 'not a string',
                                extra: 'list'
                            },
                            {
                                path: [1],
                                message: 'not a boolean',
                                extra: 'list'
                            },
                            {
                                path: [2],
                                message: 'no match found for union',
                                extra: [
                                    {
                                        path: [0],
                                        message:
                                            'no match found for an element of the list',
                                        extra: [
                                            {
                                                path: [0, 0],
                                                message: 'not a number',
                                                extra: 'boolean'
                                            },
                                            {
                                                path: [0, 1],
                                                message: 'not a number',
                                                extra: 'boolean'
                                            },
                                            {
                                                path: [0, 2],
                                                message: 'not a number',
                                                extra: 'string'
                                            }
                                        ]
                                    },
                                    {
                                        path: [1],
                                        message:
                                            'no match found for an element of the list',
                                        extra: [
                                            {
                                                path: [1, 0],
                                                message: 'not a string',
                                                extra: 'boolean'
                                            },
                                            {
                                                path: [1, 1],
                                                message: 'not a string',
                                                extra: 'boolean'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ])
    })
})
