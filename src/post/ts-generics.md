---
title: 泛型
date: 2021-07-17T16:46:21+08:00
tags:
  - TypeScript
---

用一个东西来表示广泛的类型，俗称泛型。

## 基础用法

如下定义的 T，该函数表示你传入什么类型的值，我就会返回什么类型的值。

```typescript
function identity<T>(arg: T): T {
  return arg
}

const a = identity('hi')
console.log(a) // hi
```

你还可以将 T 的类型显示的传入

```typescript
// 指定为字符串
const a = identity<string>('hi')
console.log(a) // hi

// 指定为数字
const b = identity<number>(1)
console.log(b)
```

也可以通过以下方式声明该函数

```typescript
function identity(arg) {
  return arg
}

let identity2: <T>(sth: T) => T = identity
const b = identity2<number>(1)
console.log(b) // 1
```

## 在对象类型中声明

```typescript
function identity<T>(array: T[]): T[] {
  return array
}

let a = identity<number>([1, 2, 3])
console.log(a)
```

## 与接口结合使用

调用时传入

```typescript
interface Human {
  name: string,
  age: number
}

function identity<T>(array: T[]): T[] {
  return array
}

let a = identity<Human>([{name: 'Jack', age: 18}])
console.log(a)
```

声明时传入，假如创建一个支持任何相同类型相加的函数接口：

```typescript
interface anyAdd<T> {
  (a: T, b: T): T;
}

let stringAdd: anyAdd<string> = (a1, b1) => {
  return a1 + b1
}

console.log(stringAdd('水', '饺')) // '水饺'

let numberAdd: anyAdd<number> = (a2, b2) => {
  return a2 + b2
}

console.log(numberAdd(1, 2)) // 3
```

有时候需要传入特定限制的类型，如带有 length 属性的类型数据，这时就可以使用 继承 + 接口 来限制

```typescript
interface hasLength {
  length: number;
}

function identity<T extends hasLength>(value: T): T {
  console.log(value.length)
  return value
}

const s = identity<string>('hi')
console.log(s)
// 2
// 'hi'
```

## 构造函数的类型（类）

限制输入类型必须为构造函数（类）

```typescript
function create(c: { new(): Object }) {
  return new c()
}
```

使用泛型限制输入类型必须为指定类型的构造函数（类）

```typescript
function create<T>(c: { new(): T }) {
  return new c()
}
class Human {}

let jack = create<Human>(Human)
```

## 其他

用泛型表示已知类型的对象

```typescript
Array<number>
```
