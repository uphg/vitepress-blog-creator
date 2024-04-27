---
title: TypeScript 基本语法
date: 2021-08-14T22:38:22+08:00
tags:
  - TypeScript
---

## `|` 联合类型（Union Types）

只能满足其中一种条件（A 类型或 B 类型）

```typescript
type A = {
  name: 'a',
  age: number
}
type B = {
  name: 'b',
  gender: string
}

type C = A | B

const obj1: C = { name: 'a', age: 18 } // 正确
const obj2: C = { name: 'b', gender: 'boy' } // 正确
const obj3: C = { name: 'a', gender: 'girl' } // 错误，只能选 A、B 对象中的一种，不能混合创建
```

## `&` 交叉类型（Intersection Types）

已有的条件必须都满足（A 类型和 B 类型）

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
 
type ColorfulCircle = Colorful & Circle;

function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

draw({ color: "blue", radius: 42 }); // 正确

draw({ color: "red" }); // 错误：缺少 radius 属性
```

如果 A B 两种类型中的 name 类型不同，使用 `&` 后所有类型都为 `never`

```ts
interface A {
  name: boolean,
  age: number
}

interface B {
  name: string,
  state: boolean
}

const c: A & B = {
  name: '1',    // Type 'string' is not assignable to type 'never'.
  age: 15,      // Type 'number' is not assignable to type 'never'.
  state: false  // Type 'boolean' is not assignable to type 'never'.
}
```

## `!` 非空断言（Non-null assertion）

非空断言，用来告诉 TypeScript 该值的类型不可能是 `null` 或 `undefined`

```typescript
const object = {
  name: 'jack'
}

const fn = (a: number) => a + 1
const b = (document!.getElementById('myInput')! as HTMLInputElement).value

fn(Number(b))
```

## 类型推断

TS 可以根据已有代码自动推断类型

```typescript
const n = 3 // const a: 3
const a = [0, 1, null] // const a: (number | null)[]
```

包括使用构造函数时

```typescript
class A {
  a1: number;
}
class B {
  b1: string;
}
class C {
  c1: boolean;
}

const array = [new A(), new B(), new C()]
// const array: (A | B | C)[]
```

如果想要纠正自动类型推断，也可手动声明类型

```typescript
const zoo: Animal[] = [new A(), new B(), new C()] // const zoo: Animal[]
```

另外，TypeScript 还会自动根据上下文推断类型，以 window 下的默认事件对象为例

```typescript
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button); //<- 对的
  console.log(mouseEvent.kangaroo); //<- 错的！因为该参数不存在 kangaroo 属性
};
```

还可以使用 `typeof` 修饰符反推类型

```typescript
const object = {
  name: 'Jack'
}

type O = typeof object
const obj: O = { name: 'Jack' }
```

## `ReturnType<Type>`

定义函数的返回类型的 Type

```ts
declare function f1(): { a: number; b: string };
 
type T0 = ReturnType<() => string>;
// type T0 = string

type T1 = ReturnType<(s: string) => void>;
// type T1 = void

type T2 = ReturnType<<T>() => T>;
// type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
// type T3 = number[]

type T4 = ReturnType<typeof f1>;
// type T4 = { a: number; b: string; }

type T5 = ReturnType<any>;
// type T5 = any

type T6 = ReturnType<never>;
// type T6 = never

type T7 = ReturnType<string>;
// 错误：必须传入 '(...args: any) => any' 格式类型，

type T8 = ReturnType<Function>;
// 错误：类型 Function 不满足 '(...args: any) => any' 约束
// 'Function' 类型不匹配签名 '(...args: any): any'
```

## typeof 类型操作符

TypeScript 中可以使用 `typeof` 操作符直接声明类型

```typescript
let s = "hello";
let n: typeof s //let n: string
```

这种方式常常用在复杂类型中

```typescript
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate> // type K = boolean
```

假如你需要定义一个一个函数返回值的类型，但是直接使用函数名会报错

```typescript
function f() {
  return { x: 10, y: 3 }
}
type P = ReturnType<f> // 错误，不能直接传入函数名
```

这时就可以使用 `typeof` 操作符

```typescript
function f() {
  return { x: 10, y: 3 }
}
type P = ReturnType<typeof f>
// type P = { x: number; y: number; }
```

要在变量声明时使用，应该使用 `<>` 符

```typescript
const messageBox = (message: string): string => message;
// 报错
let notGood: typeof messageBox("你还好吗?");

// 应使用以下语法
let good: ReturnType<typeof messageBox>
```

## 空值类型

void 表示空，没有任何返回

```ts
function fn(): void {
  console.log('这是一个没有 return 的函数')
}
```

Null 和 Undefined

TS 和 JS 一样，也将 Null 和 Undefined 区分位两种类型，分别为 `null` 和 `undefined` 

```ts
const a: undefined = undefined 
const b: null = null
```

## 重载

TypeScript 可以通过重载来支持多种指定类型的参数验证

使用函数重载，可以让函数支持多种情况的类型判断

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b
}

console.log(add(1, 2))
console.log(add('白', '纸'))
```

## 接口

接口主要用来声明一个对象的类型，如下

```typescript
// 声明对象的类型
interface Human {
  name: string;
  age: number;
}
const a: Human = { name: '小恒', age: 18 }
console.log(a)

// 声明时可以指定 key 的类型
interface StringArray {
  [index: number]: string;
}
 
const myArray: StringArray = ['hi', 'How', 'are', 'you']
```

### 可选属性

接口的可选属性会在你键入拼写错误的属性时提示你，如下

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = {}
  if (config.clor) {
    // 错误：'StyleConfig' 中不存在 ’clor‘ 属性
    newSquare.color = config.clor;
  }
  return newSquare;
}

let mySquare = createSquare({color: "black"});
```

### 只读属性

可以在属性名前用 `readonly` 来指定只读属性，只读属性在创建后不允许修改

```typescript
interface Point {
  readonly a: number;
  readonly b: number;
}
let n: Point = { a: 10, b: 20 }
n.x = 1 // 错误！
```

### 只读数组类型

TypeScript 内置了 `ReadonlyArray<T>` 类型，它与 `Array<T>` 相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```typescript
let a: number[] = [1, 2, 3]
let b: ReadonlyArray<number> = a
b[0] = 10 // error!
b.push(4) // error!
b.length = 20 // error!
a = b // error!
```

上面代码的最后一行中，可以看到就算把整个 `ReadonlyArray` 赋值到一个普通数组也不可以。但是你可以用类型断言重写

```typescript
let a: number[] = [1, 2, 3]
let b: ReadonlyArray<number> = a
a = b as number[];
```

### 额外的属性检查

默认情况下，接口声明的对象类型只能包括列举的属性，传入不存在的属性会报错

```typescript
interface Style {
  color?: string;
  width?: number;
}

function createStyle(config: Style): void {
  console.log(config)
}

// 错误：'Style' 中不存在 'height'
const myStyle = createStyle({ height: 100, width: 100 });
```

可以通过类型断言解决这个问题

```typescript
const myStyle = createStyle({ height: 100, width: 100 } as Style)
```

**但是，更好的方法是声明一个包括字符串 key 的所有类型**

```typescript
interface Style {
  color?: string;
  width?: number;
  [key: string]: any;
}

function createStyle(config: Style): void {
  console.log(config)
}

const myStyle = createStyle({ height: 100, width: 100 } as Style)
```

### 函数类型

可以通过以下方式使用函数类型声明

```typescript
interface styleFunc {
  (first: number, last: number): boolean;
}
const fn: styleFunc = function (a, b) {
  return a > b
}

console.log(fn(1, 2))
```

嵌套的函数类型

```typescript
interface numberFunc {
  (param1: number, param2: number): number
}

const fn = function (a:number): numberFunc {
  return function(b, c) {
    return a + b + c
  }
}

console.log(fn(1)(2, 3))
```

声明函数中 `this` 的类型（如果设置了 `this` 的类型，就必须传入符合类型的 `this`）

```typescript
interface Human {
  name: string;
  age: number;
}

function fn(this: Human) {
  console.log(this)
}

fn.call({ name: 'Jack', age: 18 }) // { name: 'Jack', age: 18 }
fn() // 错误：void 类型的 this 不能分配给 Human 类型的 this
```

### 接口可以继承

基础语法

```typescript
interface A1 {
  color: string;
}

interface A2 extends A1 {
  length: number;
}

let a = {} as A2;
a.color = "blue";
a.length = 10;
console.log(a)
```

接口也可以同时继承两个接口，如下

```typescript
interface Color {
  color: string;
}
interface Height {
  height: number;
}
interface Style extends Color, Height {
  background: string;
}

const a: Style = {
  color: 'red',
  height: 20,
  background: '#ffffff'
}

console.log(a)
```

接口还可以继承继承过其他接口的接口，如下

```typescript
interface Color {
  color: string;
}
interface Height extends Color {
  height: number;
}
interface Style extends Height {
  background: string;
}

const a: Style = {
  color: 'red',
  height: 20,
  background: '#ffffff'
}

console.log(a)
```

### 特殊情况

虽然大部分情况下 TS 是严格的，但是如果你赋值时是一个变量，它可能不那么严格，如下

```typescript
interface Human {
  name: string;
  age: number;
}

let a = { name: 'Jack', age: 18, gender: 'male' }
let b: Human = a // {name: 'Jack', age: 18, gender: 'male'}

console.log(b)
```

上面的代码就没有检测出对象中不存在的 gender 属性

> 这表明 TS 实际上是 unsound（不健全的）的，也就是它的类型检查并不是那么的严格，也是有修改的空间的。

## 枚举

可以使用枚举定义常量，如果只声明第一个的值为 1，后面的值会自动按顺序声明

```ts
enum type { Up = 1, Down, Left, Right }

console.log(type.Up, type.Down, type.Left, type.Right) // 1 2 3 4
```

如果不赋值，会默认从 0 开始

```ts
enum type { Up, Down, Left, Right }

console.log(type.Up, type.Down, type.Left, type.Right) // 0,  1,  2,  3 
```

如果使用字符串枚举，必须给每个成员赋值

```ts
enum type { Up = '张三', Down = '李四', Left = '王五', Right = '陈六' }

console.log(type.Up, type.Down, type.Left, type.Right) // "张三",  "李四",  "王五",  "陈六"
```

枚举还可以根据值获取 key

```ts
enum Color {
  Red = 1,
  Blue = 2,
  Green = 3
}

let colorName: string = Color[2]
console.log(colorName) // "Blue"
```

枚举声明时支持简单的运算符（支持的运算符有：`+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`）

```typescript
enum FileAccess {
  A,
  B = 1 + 2,
  C = 2 * 2,
  D = 0 | 1
}

console.log(FileAccess.C)
```

注意，枚举是真实存在的对象，可以用对象的方式使用它

```typescript
enum E {
  X,
  Y,
  Z,
}
 
function fn(obj: { X: number }) {
  return obj.X;
}

console.log(E)
console.log(fn(E))
```

