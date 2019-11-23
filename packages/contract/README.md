# 🧱✔️ Contract

> Lightweight type validation library for JavaScript

![npm (scoped)](https://img.shields.io/npm/v/@effet/contract?style=flat-square)

`@effet/contract` is opinionated, strict by design and inspired by functional programming.

* ⏩ Collect all validation errors or bail on first failed predicate.
* 🌊 Rehydrate objects or algebraic data-types.
* 🧰 Implement your own custom data-types.

## Example

```js
const contract = object({
  foo: number,
  bar: maybe(number),
  baz: list(union(boolean, date))
})

try {
  const parsedData = parse(contract, { foo: 42, baz: [false, 'invalid', new Date()] })
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.failures)
  }
}
```

## API

#### Primitive types
Use `boolean`, `number`, `string`, `symbol` to validate a primitive type. If you need a literal value, use `literal`.
```js
isValid(number, 42) // true
isValid(literal(42), 32) // false
```

#### Maybe type
Wrap any other type with `maybe` - that will make it nullable.
```js
isValid(any, null) // false
isValid(maybe(any), null) // true
```

#### Union type
Union type validates if _any_ of its arguments validate.
```js
const contract = union(string, number)
isValid(contract, 42) // true
isValid(contract, "hello world") // true
```

#### Intersection type
Intersection type validates if _all_ of its arguments validate.
```js
const contract = intersect(shape({ foo: number }), shape({ bar: string }))

isValid(contract, { foo: 42, bar: "hello world" }) // true
```

#### List type
List type validates all of its elements.
```js
isValid(list(number), [1, 2, 3, 4]) // true
isValid(list(any), [true, "hello world", null]) // false
```

#### Object type
Object type validates all of its properties. If any is missing or there are extra ones, it fails.
```js
isValid(object({ foo: number }), { foo: 42 }) // true
isValid(object({}), { foo: 42 }) // false
```

#### Shape type
Shape type behaves similarily to `object`, but it doesn't fail if there are extra properties.
```js
isValid(object({ foo: number }), { foo: 42 }) // true
isValid(object({}), { foo: 42 }) // true
```

#### Instance type
Instance type behaves the same as `object`, but it will instead turn the object into the instance of a class.
It requires that the class implements a static function `fromJSON`.
```js
class Foo {
  constructor(value) {
    this.value = value
  }
  
  print() {
    console.log(this.value)
  }
  
  static fromJSON(json) {
    return new Foo(json.foo)
  }
}

const foo = validate(instance(Foo, { foo: number }), { foo: 42 }) // [Foo object]

foo.print() // 42
```
