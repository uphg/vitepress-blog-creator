---
title: 对象
date: 2021-08-01T09:45:13+08:00

tags:
  - JavaScript
---

## `Object.create()`

`Object.create()` 方法创建一个新对象，可以传入一个对象作为创建对象的原型。

```javascript
// 创建带有对象原型链的空对象
const obj1 = Object.create(Object.prototype)
const obj2 = new Object()
const obj3 = {}

// 创建一个没有任何原型链的对象（纯对象）
const obj4 = Object.create(null)
```

使用 `Object.create()` 追加对象的原型

```js
// 原型对象
const object1 = {
  type: 'people',
  move() {
    console.log('我会动')
  }
}
const object2 = Object.create(object1)
object2.move() // "我会动"
object2.type === object1.type // true
```

## `Object.keys()`

`Object.keys()` 方法会返回一个由一个给定对象的自身可枚举属性组成的数组。

```javascript
const obj = { name: '小明', age: 18 }
console.log(Object.keys(obj)) // ["name", "age"]
```

## `Object.values()`

`Object.values()` 方法返回一个给定对象自身的所有可枚举属性值的数组（与 for-in 循环枚举原型链中的属性有所不同）。

```javascript
const obj = { foo: 'bar', baz: 42 }
console.log(Object.values(obj)) // ['bar', 42]
```

## 设置对象属性名

使用变量作为对象属性名

```javascript
let name = 'a'
let object = {
  [name]: 1
}
console.log(object) // 输出 {a: 1}
```

对象属性名还可以做简单的运算

```javascript
let n = 2
let a = {
  [n*n + n/n + n/3]: 1
}
console.log(a) // 输出 {5.666666666666667: 1}
```

## Object.assign()

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，并且它将返回目标对象。

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// 输出：Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// 输出：Object { a: 1, b: 4, c: 5 }
```

使用 `Object.assign()` 批量赋值

```js
const obj = {
  a: 1,
  b: 2
}
Object.assign(obj, { b: 3, p1: 4, p2: 5})
// 输出：{a: 1, b: 3, p1: 4, p2: 5}
```

## `Object.getPrototypeOf()`

使用 `Object.getPrototypeOf()` 可以获取对象原型

```js
let obj1 = {}
let obj2 = {}
Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2) // true
```

几种特殊对象的原型

```js
// 空对象的原型是 Object.prototype
Object.getPrototypeOf({}) === Object.prototype // true

// Object.prototype 的原型是 null
Object.getPrototypeOf(Object.prototype) === null // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true
```

可以用以下方式获取对象原型的名称

```js
Object.getPrototypeOf([]).constructor.name  // "Array"
// 或
[].constructor.name // "Array"，前提是如果对象没有定义新的 contructor 属性
```

## `Object.setPrototypeOf()`

使用 `Object.setPrototypeOf()` 方法为对象设置原型，返回该对象。它接受两个参数，第一个是现有对象，第二个是原型对象。

```js
const a = {}
const b = { x: 1 }
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1
```

上面的代码中，`Object.setPrototypeOf` 方法将对象 `a` 的原型，设置为对象 `b`，因此 `a` 可以共享 `b` 的属性。

> 除了上面两种方式，使用 `b.__proto__ = a` 也可以设置对象的原型链，但是不推荐，此方式浏览器会默认为非法操作。

## `Object.prototype.hasOwnProperty()`

对象实例的 `hasOwnProperty` 方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。

```javascript
Date.hasOwnProperty('length') // true
Date.hasOwnProperty('toString') // false
```

上面代码表明，`Date.length`（构造函数 `Date` 可以接受多少个参数）是 `Date` 自身的属性，`Date.toString` 是继承的属性。

另外，`hasOwnProperty` 方法是 JavaScript 之中唯一一个处理对象属性时，不会遍历原型链的方法。

## `get` & `set`

通过给对象的属性设置 `get`、`set` 语法，来修改对象被读取/写入时的状态权限。

```javascript
let _age = 18
let obj = {
  get age () {
    return _age
  },
  set age (value) {
    if (value < 100) {
      _age = value
    }else{
      _age = 100
    }
  }
}
console.log(_age)   // 输出 18
console.log(obj.age) // 输出 18
obj.age = 1000
console.log(obj.age) // 输出 100
```

## `Object.defineProperty()`

该方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的对象，它的用法如下：

```javascript
Object.defineProperty(object, propertyName, attributesObject)
```

`Object.defineProperty()` 方法接受三个参数，依次如下。

- object：属性所在的对象。
- propertyName：字符串，表示属性名。
- attributesObject：属性描述对象。

假如一个对象之前并没有添加 `get` `set` 语法，就可以使用以下方式追加

```javascript
let i = 2
let object = {
  a: 1,
  b: 2
}
Object.defineProperty(object, 'x', {
  get() { return i },
  set(value) {
    i += value
    return i
  }
})
object.x = 100
object.x // 102
```

## 实现 `a === 1 && a === 2 && a === 3` 结果为 `true`

```javascript
let i = 0
/* 给 window 添加一个属性，属性名是 a，a 有一个 get 函数 */
Object.defineProperty(window, 'a', {
  get(){
    i+=1
    return i
  },
})
a === 1 && a === 2 && a === 3 // 输出 true
```

> 该方法就是通过 `Object.defineProperty` 添加 `get` 语法来设置全局变量 a 的读取过程，每次访问 a 的值都会改变。

## 实现一个简单的 undefined

在 JavaScript 中，`undefined` 不是关键字 而是一个只读的变量，证明如下

```javascript
var function // 报错
var null // 报错
var this // 报错
var undefined // undefined
undefined = 1
undefined // undefined
```

所以，如果给变量添加 get 语法，它就可以基本的实现 `undefined` 的只读原理

```javascript
let object = {
  get undefined() { return undefined }
}
object.undefined // undefined
object.undefined = 'jack'
object.undefined // undefined
```

上面的代码中 `o.undefined` 每次访问的值都是 `undefined`，不可修改，这就像 `undefined` 的只读性。

通过给变量设置 `writable` 属性为 `false`，也可以实现只读。

```javascript
let object = { name: undefined }
Object.defineProperty(object, 'name', { writable: false })
object.name // undefined
object.name = 'jack'
object.name // undefined
```

上面的代码通过设置，`o.name` 属性的 `writable: false` 使得该属性为不可修改的，从而实现类似 `undefined` 的只读性。

需要注意的是，将 `writable` 属性设置为 `true` 只读属性就会变回可写的。

```javascript
let object = { name: undefined }
Object.defineProperty(object, 'name', { writable: true })
object.name = 'xxx'
object.name // "xxx"
```

## `configurable` 禁止修改属性

禁止修改属性，如：value，writable，get，set等

当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
默认值为 false。（设置 configurable 为 true 时，无法修改属性）

将上面的对象 o 的 configurable 设置为 true

```js
let o = {name: undefined}
Object.defineProperty(o, 'name', {writable: false, configurable: false})
// 此时再修改writable的属性会报错：
Object.defineProperty(o, 'name', {writable: true}) // 报错
```

## `enumerable` 可枚举属性

默认情况下 遍历某个对象或数组，并不能完全遍历该对象/数组的所有属性

```js
// 对象的toString属性并不能被遍历
let obj = {a: 1, b: 2, c: 3}
for(let key in obj){
  console.log(key)
}
// a b c

// 数组的length属性并不能被遍历
let num = [1, 2, 3]
for(let key in num){
  console.log(key)
}
// 0 1 2
```

我们可以通过给对象添加一个 enumerable 修饰符来修改，该对象的属性是否可遍历

```js
let obj = {a: 1, b: 2, c: 3}
Object.defineProperty(obj, 'b', {value: 2, enumerable: false})
for(let key in obj){
  console.log(key)
}
// a c
```

查看对象的属性描述

```js
Object.getOwnPropertyDescriptor(obj, 'b')
// {value: 2, writable: true, enumerable: false, configurable: true}
Object.getOwnPropertyDescriptor(obj, 'a')
// {value: 1, writable: true, enumerable: true, configurable: true}
```

可以批量的给属性添加修饰符

```js
Object.defineProperties(o, {
  a: {value: 1, writable: false},
  b: {value: 2, writable: true}
})
o.a = 2
o.a // 1
o.b = 4
o.b // 4
```

## 使用 Symbol 设置对象的 key

```js
let s = Symbol()
let o = {[s]: 1}
o[s] // 1
```

Symbol 设置的key只能通过 `getOwnPropertySymbols` 的方式获取

```js
// 获取对象的key 方法1
Object.keys(o) // []
// 获取对象中的 Symbol key
Object.getOwnPropertySymbols(o) // [Symbol()]
// 获取对象的key 方法2
Object.getOwnPropertyNames(o) // []
```

## 参考文档

MDN 文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
