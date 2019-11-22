import { isValid, string } from '../src/index.js'

describe('isValid function', () => {
    it('should return true if passes', () => {
        const input = 'value'

        const result = isValid(string, input)

        expect(result).to.equal(true)
    })

    it('should return false if fails', () => {
        const input = null

        const result = isValid(string, input)

        expect(result).to.equal(false)
    })
})
