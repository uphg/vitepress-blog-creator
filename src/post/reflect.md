---
title: Reflect
date: 2020-03-31 21:14:32

tags:
  - JavaScript
  - ES6
  - Proxy
  - Reflect
---

## 概述

`Reflect`对象与`Proxy`对象一样，也是 ES6 为了操作对象而提供的新 API。`Reflect`对象的设计目的有这样几个。

1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。

2. 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

## Reflect

### Reflect.get()

`Reflect.get` 方法可以获取对象的属性

```js
const object = {
  a: 1,
  b: 2
}
Reflect.get(object, 'a')
```

通过反射将当前对象的关联属性作用于其他对象

```js
const object = {
  a: 1,
  b: 2,
  get addUp() {
    return this.a + this.b
  }
}
const object2 = {
  a: 3,
  b: 3
}
Reflect.get(object, 'addUp', object2) // 6
```

### Reflect.set()

`Reflect.set` 方法可以修改属性

```js
const object = {
  name: 'Jack',
  gender: '男'
}
Reflect.set(object, 'name', 'Brave')
console.log(object.name) // "Brave"
```

同样可以通过反射将当前对象的关联属性作用于其他对象

```js
const object = {
  name: 'Jack',
  gender: '男',
  set setName(value) {
    return this.name = value
  }
}
const object2 = {
  name: '小明',
  gender: '男'
}
Reflect.set(object, 'name', '小红', object2)
console.log(object2.name) // "小红"
```

### Reflect.apply()

`Reflect.apply` 方法等同于 `Function.prototype.apply.call(func, thisArg, args)`

```js
const min = Math.min
min(1, 2, 3) // 1

const min = (...args) => Math.min.apply(Math, args)
min(1, 2, 3) // 1

const min = (...args) => Reflect.apply(Math.min, undefined, args)
min(1, 2, 3) // 1
```

### Reflect.construct(target, args)

`Reflect.construct` 方法等同于 `new target(...args)`

如果不设置参数，调用时也必须传入一个空数组

```js
function Fn(){
  this.name = '小恒恒'
}
new Fn() // {name: '小恒恒'}
Reflect.construct(Fn, []) // {name: '小恒恒'}
```

or 设置参数

```js
function Fn(name){
  this.name = name
}
new Fn('小红红') // {name: '小红红'}
Reflect.construct(Fn, ['小红红']) // {name: '小红红'}
```