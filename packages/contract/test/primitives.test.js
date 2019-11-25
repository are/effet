import {
    getErrors,
    string,
    number,
    boolean,
    getTypeName,
    any
} from '../src/index.js'

describe('string validator', () => {
    it('should fail when not a string', () => {
        const input = 3

        const result = getErrors(string, input)

        expect(result).to.deep.equal([
            { path: [], message: 'not a string', extra: 'number' }
        ])
    })

    it('should pass when string is empty', () => {
        const input = ''

        const result = getErrors(string, input)

        expect(result).to.deep.equal([])
    })
})

describe('number validator', () => {
    it('should fail when NaN', () => {
        const input = NaN

        const result = getErrors(number, input)

        expect(result).to.deep.equal([
            { path: [], message: 'not a number', extra: 'nan' }
        ])
    })

    it('should fail when Infinity', () => {
        const input = Infinity

        const result = getErrors(number, input)

        expect(result).to.deep.equal([
            { path: [], message: 'not a number', extra: 'unknown' }
        ])
    })

    it('should pass for 0', () => {
        const input = 0

        const result = getErrors(number, input)

        expect(result).to.deep.equal([])
    })

    it('should pass for negative numbers', () => {
        const input = -10000

        const result = getErrors(number, input)

        expect(result).to.deep.equal([])
    })
})

describe('boolean validator', () => {
    it('should fail for falsey values (without false)', () => {
        const falseys = ['', 0, null, undefined, NaN]

        const results = falseys.map(input => getErrors(boolean, input))

        expect(results).to.deep.equal([
            [{ message: 'not a boolean', path: [], extra: 'string' }],
            [{ message: 'not a boolean', path: [], extra: 'number' }],
            [{ message: 'not a boolean', path: [], extra: 'nil' }],
            [{ message: 'not a boolean', path: [], extra: 'undef' }],
            [{ message: 'not a boolean', path: [], extra: 'nan' }]
        ])
    })

    it('should pass for true and false', () => {
        const values = [true, false]

        const results = values.map(input => getErrors(boolean, input))

        expect(results).to.deep.equal([[], []])
    })
})

describe('any validator', () => {
    it('should fail for undefined and null', () => {
        const values = [null, undefined]

        const results = values.map(input => getErrors(any, input))

        expect(results).to.deep.equal([
            [
                {
                    message: 'expected a value, instead got nil',
                    path: [],
                    extra: 'nil'
                }
            ],
            [
                {
                    message: 'expected a value, instead got undef',
                    path: [],
                    extra: 'undef'
                }
            ]
        ])
    })

    it('should pass for any other value than undefined or null', () => {
        const values = [1, '', Symbol('test'), {}, []]

        const results = values.map(input => getErrors(any, input))

        expect(results).to.deep.equal([[], [], [], [], []])
    })
})
