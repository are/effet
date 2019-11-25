import {
    getErrors,
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

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([])
    })

    it('should fail if all of the subvalidators fail', () => {
        const shape = union(object({ value: number }), string, boolean)
        const input = null

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([
            {
                message: 'cannot validate the union',
                path: [],
                extra: undefined
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

        const validResult = getErrors(shape, validInput)
        const invalidResult = getErrors(shape, invalidInput)

        expect(validResult).to.deep.equal([])
        expect(invalidResult).to.deep.equal([
            {
                message: 'cannot validate the union',
                path: [],
                extra: undefined
            }
        ])
    })
})
