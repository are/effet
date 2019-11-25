import {
    getErrors,
    maybe,
    any,
    string,
    union,
    number,
    list
} from '../src/index.js'

describe('maybe validator', () => {
    const cases = [
        ['any', any, 0],
        ['any', any, null],
        ['any', any, undefined],
        ['any', any, 'string'],
        ['any', any, {}],
        ['any', any, []],
        ['any', any, Symbol('symbol')],
        ['any', any, () => {}],
        ['string', string, null],
        ['string', string, 'value'],
        [
            'string',
            string,
            6,
            [{ message: 'not a string', path: [], extra: 'number' }]
        ],
        ['union(string, number)', union(string, number), 'value'],
        ['union(string, number)', union(string, number), 42],
        ['union(string, number)', union(string, number), null],
        ['union(string, number)', union(string, number), undefined],
        [
            'union(string, number)',
            union(string, number),
            false,
            [
                {
                    message: 'cannot validate the union',
                    path: [],
                    extra: undefined
                }
            ]
        ],
        ['list(any)', list(any), []],
        ['list(any)', list(any), null],
        ['list(any)', list(any), undefined],
        ['list(any)', list(any), [3, 'value']],
        [
            'list(any)',
            list(any),
            {},
            [{ message: 'not a list', path: [], extra: 'object' }]
        ],
        ['list(maybe(any))', list(maybe(any)), [null, undefined]]
    ]

    for (let [name, validator, input, expectedResult] of cases) {
        it(`should validate ${JSON.stringify(
            input
        )} with maybe(${name}) `, () => {
            const shape = maybe(validator)

            const result = getErrors(shape, input)

            expect(result).to.deep.equal(
                expectedResult === undefined ? [] : expectedResult
            )
        })
    }
})
