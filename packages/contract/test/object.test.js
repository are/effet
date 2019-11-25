import { getErrors, object, getTypeName, any } from '../src/index.js'

describe('object validator', () => {
    const cases = [
        [null, [{ path: [], message: 'not an object', extra: 'nil' }]],
        [10, [{ path: [], message: 'not an object', extra: 'number' }]],
        ['foo', [{ path: [], message: 'not an object', extra: 'string' }]],
        [false, [{ path: [], message: 'not an object', extra: 'boolean' }]],
        [new Date(), [{ path: [], message: 'not an object', extra: 'date' }]],
        [() => {}, [{ path: [], message: 'not an object', extra: 'fn' }]],
        [
            Symbol('symbol'),
            [{ path: [], message: 'not an object', extra: 'symbol' }]
        ],
        [[], [{ path: [], message: 'not an object', extra: 'list' }]]
    ]

    for (let [input, expectedResult] of cases) {
        it(`should fail when passed '${getTypeName(input)}'`, () => {
            const shape = object({})

            const result = getErrors(shape, input)

            expect(result).to.deep.equal(expectedResult)
        })
    }

    it('should fail when there are missing keys', () => {
        const shape = object({ foo: any, bar: any })
        const input = { foo: 42 }

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([
            { path: [], message: 'missing keys', extra: ['bar'] }
        ])
    })

    it('should fail when there are extraneous keys', () => {
        const shape = object({ foo: any })
        const input = { foo: 42, bar: 'hello' }

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([
            { path: [], message: 'extraneous keys', extra: ['bar'] }
        ])
    })

    it('should pass when all keys are valid', () => {
        const shape = object({ foo: any, bar: any })
        const input = { foo: 42, bar: 'hello' }

        const result = getErrors(shape, input)

        expect(result).to.deep.equal([])
    })
})
