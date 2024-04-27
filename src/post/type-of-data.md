---
title: JavaScript 数据类型
date: 2021-07-31T22:14:02+08:00

tags:
  - JavaScript
---

## 数据类型概述

最新的 ECMAScript 标准定义了 8 种数据类型：

- Boolean
- Number
- String
- BigInt
- Symbol
- null
- undefined
- Object

> 任何 constructed 对象实例的特殊非数据结构类型，也用做数据结构：`new Object`，`new Array`，`new Map`，`new Set`，`new WeakMap`，`new WeakSet`，`new Date`，和几乎所有通过 `new keyword` 创建的东西，都属于 Object 类型（复杂类型）。

## typeof 运算符

`typeof` 操作符返回一个字符串，表示未经计算的操作数的类型。

```javascript
typeof 37 === 'number'
typeof 'blue' === 'string'
typeof (typeof 1) === 'string'
typeof 42n === 'bigint'
typeof Symbol() === 'symbol'

// 应使用 Array.isArray 或者 Object.prototype.toString.call 区分数组和普通对象 
typeof [1, 2, 4] === 'object'

// new 后的对象一律为 "object" 类型
typeof new Boolean(true) === 'object'
typeof new Number(1) === 'object'
typeof new String('abc') === 'object'

// 函数
typeof function() {} === 'function'
typeof class C {} === 'function'
typeof Math.sin === 'function'

// JavaScript 特性
typeof null === 'object'

// 历史遗留问题（IE）
typeof document.all === 'undefined'
```

返回值总结

| 类型          | 返回值        |
| ------------- | ------------- |
| **undefined** | `"undefined"` |
| **boolean**   | `"boolean"`   |
| **number**    | `"number"`    |
| **string**    | `"strign"`    |
| **bigint**    | `"bigint"`    |
| **symbol**    | `"symbol"`    |
| **null**      | `"object"`    |
| **object**    | `"object"`    |
| **function**  | `"function"`  |

## null 和 undefined

`null` 表示空值，`undefined` 表示“未定义”，他们的区别主要表现如下

```javascript 
Number(null) // 0
5 + null // 5

Number(undefined) // NaN
5 + undefined // NaN
```

`undefined` 的常见场景

```javascript
// 变量声明但未赋值
let a
a // undefined

// 调用函数时没有传参
function fn(x) { return x }
fn() // undefined

// 函数默认 return
function f() {}
f() // undefined

// 对象没有赋值的属性
let o = {}
o.p // undefined
```

## 布尔值

在 JavaScript 中，除了下面 7 个值被转为 `false`，其他值都视为 `true`。

- `undefined`
- `null`
- `false`
- `0`
- `NaN`
- `""` 或 `''`（空字符串）
- `document.all`（IE 遗留问题）
  
### Boolean

`Boolean` 对象除了可以作为构造函数，还可以单独使用，将任意值转为布尔值

```javascript
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean('') // false
Boolean(NaN) // false
Boolean(document.all) // false

Boolean(1) // true
Boolean('false') // true
Boolean([]) // true
Boolean({}) // true
Boolean(function () {}) // true
Boolean(/foo/) // true
```

## 数值

### 整数和浮点数

JavaScript 内部，所有数字都是以 64 位浮点数形式储存，即使整数也是如此。所以，1 与 1.0 是相同的，是同一个数。

```javascript
1 === 1.0 // true
```

由于浮点数不是精确的值，所以涉及小数的比较和运算要特别小心。

```javascript
0.1 + 0.2 === 0.3
// false

0.3 / 0.1
// 2.9999999999999996

(0.3 - 0.2) === (0.2 - 0.1)
// false
```

### 数值精度

JavaScript 提供 `Number` 对象的 `MAX_VALUE` 和 `MIN_VALUE` 属性，返回可以表示的具体的最大值和最小值。

```javascript
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324
```

### 数值常用方法

**`parseInt()`**

用于将字符串转为整数。

```javascript
parseInt('15px') // 15
parseInt('10', 10) // 10
parseInt('10', 0) // 10
parseInt('10', null) // 10
parseInt('10', undefined) // 10
```

**`parseFloat()`**

将一个字符串转为浮点数，如果参数不是字符串，或者字符串的第一个字符不能转化为浮点数，则返回NaN。

```javascript
parseFloat('3.14') // 3.14
parseFloat('3.14more non-digit characters') // 3.14
parseFloat([]) // NaN
parseFloat('FF2') // NaN
```

**`isNaN()`**

判断一个值是否为 `NaN`。

```javascript
isNaN(NaN) // true
isNaN(123) // false
```

`isNaN` 只对数值有效，如果传入其他值，会被先转成数值。

```javascript
isNaN('Hello') // true
// 相当于
isNaN(Number('Hello')) // true
```

因此，使用 `isNaN` 之前，最好判断一下数据类型。

```javascript
function numberIsNaN(value) {
  return typeof value === 'number' && isNaN(value);
}
```

**`isFinite()`**

该方法返回一个布尔值，表示某个值是否为正常的数值。

```javascript
isFinite(Infinity) // false
isFinite(-Infinity) // false
isFinite(NaN) // false
isFinite(undefined) // false
isFinite(null) // true
isFinite(-1) // true
```

## 字符串

### 字符串的多种写法

```javascript
const message = 'hi'
const string1 = "<p>" + message + "</p>"
const string2 = `<p>${ message }</p>`
```

### 函数调用字符串

函数后不加括号接一个字符串，会将该字符串的信息传入函数，如下：

```js
const name = 'Jack'
const person = '人'
const fn = function () {
  console.log(arguments)
}
fn`${name} 是一个 ${person}` 
/* 输出:
[
  0: ["", " 是一个 ", ""]
  1: "Jack"
  2: "人"  
]
 */
```

上面的案例输出的是一个数组，其中第一项是不包含变量的每段字符串组成的数组，后两项是两个变量的值

**使用案例**

在函数内可以判断传两个变量，根据对应变量返回对应值

```js
const name = 'Jack'
const person = '人'
const fn = function () {
  console.log(arguments)
  const strings = arguments[0]
  const var1 = arguments[1]
  const var2 = arguments[2]
  if(var1 === 'Jack'){
    return var1 + strings[1] + '好人'
  } else {
    return var1 + strings[1] + '坏人'
  }
}
fn`${name} 是一个 ${person}` 
```

> 实际上，在 React 中的 [styled-components](https://github.com/styled-components/styled-components#example) 就是使用了这种方法，在 `styled.h1` 后加一段字符串格式的样式，函数会自动将字符串中的样式嵌到页面中。

