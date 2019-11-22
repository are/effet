# `@effet/contract`

> Small, lightweight contracts for validating values, native to Javascript

This library aims to create a small validator that doesn't compromises for Flow or Typescript. It is functional, strict by design and opinionated.

## Usage

```
import { validate, validators as t } from '@effet/contract'

const contract = t.object({
  foo: t.number,
  bar: t.maybe(t.number),
  baz: t.list(t.union(t.boolean, t.date))
})

const errors = validate(contract, { foo: 42, baz: [false, 'invalid', new Date()] })

expect(errors).toEqual([
  {
    path: ['baz'],
    message: 'no match found for an element of the list',
    extra: [
      {
        path: ['baz', 1],
        message: 'no match found for union',
        extra: [
          { path: ['baz', 1], message: 'not a boolean', extra: 'string' },
          { path: ['baz', 1], message: 'not a date', extra: 'string' }
        ]
    ]
  }
])

```
