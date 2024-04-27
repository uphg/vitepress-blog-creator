---
title: Funt - 类型
date: 2021-12-28T20:55:39+08:00
tags:
  - JavaScript
---

## string & boolean & number & symbol & bigInt

基本都使用 `typeof value === 'type'` 的方式判断，只有布尔使用严格相等的 `true` 或 `false`，以 isString 为例：

```ts
function isString(value: unknown) {
  return typeof value === 'string'
}
```

## null & undefined

`undefined` 使用 `void 0` 判断，主要原因：

- 低版本 IE 中可以篡改 undefined
- `void` 总返回 `undefined`
- `void 0` 是最省字节的写法

最终封装如下

```ts
function isNil(value: unknown) {
  return value === void 0 || value === null
}
```

## Function

Function 使用 typeof 判断

```ts
function isFunction(value: unknown) {
  return typeof value === 'function'
}
```

## arguments & Date & RegExp & Set & Map & WeakSet & WeakMap

默认都使用 `Object.prototype.toString` 方法判断，如下

```js
function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]'
}
```

但，像 Set & Map & WeakSet & WeakMap 这种新增的数据类型，在 IE 中还是无法识别

```js
const getTag = (value) => Object.prototype.toString.call(value)

// IE 11
getTag(new Map) // '[object Object]'
getTag(new Set) // '[object Object]'
getTag(new WeakMap) // '[object Object]'
getTag(new WeakSet) // “WeakSet”未定义
```

不过可以判断是否为 IE 做特殊处理

## IE 兼容

首先封装一个，判断对象的 toString 是否为 `'[object Object]'` 函数

```js
const hasObjectTag = (value) => getTag(value) === '[object Object]'
```

再判断 IE 10 - Edge 13 和 IE 11

```js
// 在 IE 10 - Edge 13 中，`DataView` 的字符串标签为 `'[object Object]'`
// 在 IE 11 中，这个问题也适用于`Map`、`WeakMap`和`Set`。

// IE 11
const isIE11 = typeof Map !== 'undefined' && hasObjectTag(new Map)

// IE 10 - Edge 13
const supportsDataView = typeof DataView !== 'undefined'
const hasStringTagBug = supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
```

## 类对象（isObjectLike）

typeof 为 `'object'` 并且不为 `null` 的值，通常用来区分对象和函数

```js
function isObjectLike(value: unknown) {
  return typeof value === 'object' && value !== null 
}
```

## 类数组（isArrayLike）

只要满足两个条件，就是一个类数组。第一，不为空；第二，存在一个安全范围内的正整数的 length 属性

首先判断满足 length 属性的值

```ts
const MAX_SAFE_INTEGER = 9007199254740991

function isLength(value: unknown) {
  return typeof value ==='number'
    && value > -1
    && value % 1 === 0
    && value <= MAX_SAFE_INTEGER
}
```

再判断满足条件的类数组

```ts
function isArrayLike(value: any) {
  return value !== void 0
    && value !== null
    && typeof value !== 'function'
    && isLength(value.length)
}
```

## 类数组对象（isArrayLikeObject）

同时满足 isObjectLike 和 isArrayLike 的类型

```js
function isArrayLikeObject(value: any) {
  return isObjectLike(value) && isArrayLike(value)
}
```

## 原始对象（isPlainObject）

判断对象是否为原始对象，原始对象包括由 Object 实例创建的对象，和原型指向为 `null` 的对象

```js

```

## arguments 兼容 IE

在 IE < 9 浏览器下 `Object.prototype.toString.call(arguments)` 为 `[object Object]`，为了兼容 IE，可以判断 arguments 是否存在 callee 属性 callee 属性会返回当前 arguments 所在函数

```js

```