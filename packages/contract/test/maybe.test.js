import {
    validate,
    maybe,
    any,
    string,
    union,
    number,
    list
} from '../src/index.js'

describe('maybe validator', () => {
    const cases = [
        [any, 0],
        [any, null],
        [any, undefined],
        [any, 'string'],
        [any, {}],
        [any, []],
        [any, Symbol('symbol')],
        [any, () => {}],
        [string, null],
        [string, 'value'],
        [string, 6, [{ message: 'not a string', path: [], extra: 'number' }]],
        [union(string, number), 'value'],
        [union(string, number), 42],
        [union(string, number), null],
        [union(string, number), undefined],
        [
            union(string, number),
            false,
            [
                {
                    message: 'no match found for union',
                    path: [],
                    extra: [
                        {
                            message: 'not a string',
                            path: [0],
                            extra: 'boolean'
                        },
                        { message: 'not a number', path: [1], extra: 'boolean' }
                    ]
                }
            ]
        ],
        [list(any), []],
        [list(any), null],
        [list(any), undefined],
        [list(any), [3, 'value']],
        [list(any), {}, [{ message: 'not a list', path: [], extra: 'object' }]],
        [list(maybe(any)), [null, undefined]]
    ]

    for (let [validator, input, expectedResult] of cases) {
        it(`should make ${validator.name} nullable`, () => {
            const shape = maybe(validator)

            const result = validate(shape, input)

            expect(result).to.deep.equal(
                expectedResult === undefined ? [] : expectedResult
            )
        })
    }
})
