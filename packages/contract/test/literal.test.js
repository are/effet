import { getErrors, literal } from '../src/index.js'

describe('literal validator', () => {
    it('should fail when value is different', () => {
        const input = 1337

        const result = getErrors(literal(42), input)

        expect(result).to.deep.equal([
            { path: [], message: 'cannot validate the literal', extra: 1337 }
        ])
    })

    it('should pass when value is the same', () => {
        const input = 'Hello world'

        const result = getErrors(literal('Hello world'), input)

        expect(result).to.deep.equal([])
    })
})
