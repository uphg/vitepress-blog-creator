---
title: Symbol & 迭代器 & 生成器
date: 2020-05-19T08:51:15+08:00

tags:
  - JavaScript
---



## 大纲

**之前的 7 种数据类型**

```
string number boolean undefined null object symbol
```

最新的 ECMAScript 标准（ES10）添加了：[BigInt](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)

**三种 for**

```
for(let i=0; i<10; i++){} // 循环
for(let key in object){} // 遍历一个对象
for(let item of iterableObject){} // 可迭代对象
```

> for in 与 for of 的区别：迭代是一个一个访问，中间会有停顿，但遍历是访问所有内容，中间不会有停顿。

## 数据类型

**最新的 ECMAScript 标准定义了 8 种数据类型:**

7 种原始类型

- [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)
- [Null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)
- [Undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined)
- [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)
- [BigInt](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)
- [String](https://developer.mozilla.org/zh-CN/docs/Glossary/字符串)
- [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol) 

和 [Object](https://developer.mozilla.org/zh-CN/docs/Glossary/Object)

MDN 原文：[JavaScript 数据类型和数据结构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

> 注意：
>
> - array function date regex(正则) 都属于 object 类型
>
> - Object 属于复杂类型（也称引用类型），其他7种属于简单类型（也称基本类型）
>
> - Symbol 类型是 ES6 新增
>
> - BigInt 类型是 ES10 新增

## Symbol的使用

```js
let race = {
  神族: 'protoss', 人族: 'terran', 虫族: 'zerg'
}
function createdRole(input) {
  if(input === race.神族){ console.log('你选择了神族') }
  else if(input === race.神族) { console.log('你选择了人族') }
  else if(input === race.神族) { console.log('你选择了虫族') }
}

createdRole('protoss') // 你选择了神族

/* 一般推荐用这样的传参方式（因为这样的方式更准确，当你写的对象属性出错时会报错，而直接传入字符串并不会报错，只会返回undefined）： */
createdRole(race.神族) // 你选择了神族
```
当你将上面代码中的race对象的属性值都改变时，其实并不会影响运行结果，也就是我们并不关心它们属性的值是什么，只要每个属性的值不相同即可，如下：

```js
let race = {
    神族: 1, 人族: 2, 虫族: 3
}
function createdRole(input) {
  if(input === race.神族){ console.log('你选择了神族') }
  else if(input === race.神族) { console.log('你选择了人族') }
  else if(input === race.神族) { console.log('你选择了虫族') }
}

createdRole(race.神族) // 你选择了神族
```

这时就可以使用symbol，给每个属性创造一个独一无二的值：

```js
let race = {
  神族: Symbol(), 人族: Symbol(), 虫族: Symbol()
}
race.神族 === race.人族 // false
race.神族 === race.虫族 // false
```

## 迭代器

在 JavaScript 中，**迭代器**是一个对象，它定义一个序列，并在终止时可能返回一个返回值。 更具体地说，迭代器是通过使用 `next()` 方法实现 [Iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) 的任何一个对象，该方法返回具有两个属性的对象： `value`，这是序列中的 next 值；和 `done` ，如果已经迭代到序列中的最后一个值，则它为 `true` 。如果 `value` 和 `done` 一起存在，则它是迭代器的返回值。

一旦创建，迭代器对象可以通过重复调用 `next()` 显式地迭代。 迭代一个迭代器被称为消耗了这个迭代器，因为它通常只能执行一次。 在产生终止值之后，对 `next()` 的额外调用应该继续返回 `{done：true}`。

**概述**

迭代器是一个对象，每次调用它的 `.next()` 方法都会返回一个版本，当达到最终版本时，它的 done 属性会返回 true，之后方法的每次调用 done 都会返回 true

**案例**

创建一个发布器，每次调用它的`_value`值都加一

```js
function 发布器(){
    var _value = 0
    return {
        next: function(){
            _value += 1
            return {
                value: _value
            }
        }
    }
}
```

给发布器添加一个 done 属性，当发布到最大值时 done 的值变为 true

```js
function 发布器(){
    var _value = 0
    var max = 5
    return {
        next: function(){
            _value += 1
            if(_value > max){ throw new Error('报错，已经没有下一个了！') }
            if(_value >= max){
                return { value: _value, done: true }
            }else {
                return { value: _value, done: false }
            }
        }
    }
}
```

调用

```js
a.next()
{value: 1, done: false}
a.next()
{value: 2, done: false}
...
a.next()
{value: 5, done: true}
```

每次调用 value 的值都会加一，当达到最大值时会提示报错，并返回 done 的值为 true

## 生成器（迭代器生成语法糖）

案例（ES6语法）

```js
function* 发布器(){
    var version = 0
    while(true){
        version += 1
        yield version;
    }
}
```

调用，每次调用都会返回两个值，与上面生成器的案例一样

```js
let a = 发布器()
a.next()
{value: 1, done: false}
a.next()
{value: 2, done: false}
...
```

> 生成器在日常生活中并不常用，所以记住即可

## `for of`（迭代器访问语法糖）

**案例**

```js
let array = [1, 2, 3]
for(let item of array){
    console.log(item)
}
// 1 2 3
```

### 真正的遍历

当我们遍历一个数组时

```js
array = [1, 2, 3]
for(let i = 0; i < array.length; i++){
    console.log(array[i])
}
// 输出：1 2 3
```

其实我们只遍历了数组中的数字，假如给数组添加一个属性：

```js
array['x'] = 'y'
```

此时数组变成了 4 项，但是 x 应该被遍历吗？

```js
console.log(array)
// 输出：[1, 2, 3, x: "y"]
```

将上面的数组用对象模拟：

```js
object = {'0': 1, '1': 2, '2': 3, 'x': 'y'}
```

此时对象中的 x 该不该被遍历呢？你会发现在对象中它理论上是应该被遍历的

查看上面的数组的下标，你会发现其实数组并没有下标

```js
Object.keys(array)
// 输出：["0", "1", "2", "x"]
```

将上面的对象变为数组

```js
object = {'0': 1, '1': 2, '2': 3, 'x': 'y'}
object.length = 3
object.__proto__ = Array.prototype
console.log(object)
// 此时的object变为了：[1, 2, 3, x: "y"]，并且带有length属性
```

> 结论：其实只是我们认为遍历数组应该通过下标遍历，但实际上的遍历应该将每个属性都遍历，例如下面的 `for in` 遍历。

### `for in` 和 `for of` 的区别

**`for in` 遍历**

```js
let array = [1, 2, 3]
let object = {a: 1, b: 2, c: 3}
for(let key in array){
    console.log(key)
}
// 输出：0 1 2
for(let key in object){
    console.log(key)
}
// 输出：a b c
```

**`for of`遍历**

数组

```js
let array = [1, 2, 3]
for(let key of array){
    console.log(key)
}
// 输出：1 2 3
```

对象

```js
let object =  {a: 1, b: 2, c: 3}
for(let key of object){
    console.log(key)
}
// 报错：Uncaught TypeError: object is not iterable
```

> 因为 `for of` 使用的是迭代的方法，迭代是一个一个访问，遍历是访问所有属性。迭代访问需要一定的顺序，而对象是没有顺序的，所以数组可以迭代，而对象不可以迭代

### 数组和对象遍历的区别

当我们遍历一个数组或对象时

```js
let array = { '0': 1, '1': 2, '2': 3, 'length': 3 }
let object = { '0': 1, '1': 2, '2': 3, 'x': 'y'}
```

我们通常会认为上面的数组是有顺序的，而对象并没有。但是其实**数组存储的顺序并不会影响我们的遍历结果，因为我们给数组强行指定了遍历顺序**，假如将上面的数组改为：

```js
let array = { '0': 1, '2': 3, '1': 2, 'length': 3 }
```

当你使用 for  循环遍历时，依然是按下标顺序遍历：

```js
for(let i = 0; i < array.length; i++){
    console.log(array[i])
}
// 输出：1 2 3
```

上面的代码中，由于我们 i 的顺序是固定的，所以结果的顺序依然是固定的，即使数组中每个值存储的位置不同。

数组与对象的区别：

```js
// 声明一个数组
let arr = []
// 声明一个对象
let obj = {}
// 数组的原型链
arr.__proto__ === Array.prototype // true
// 对象的原型链
obj.__proto__ === Object.prototype // true
```

**只要是对象，就可以遍历，但是只有符合某些特征的对象（如数组）才能迭代**

### 判断对象是否可迭代

通过判断该对象是否存在 `[Symbol.iterator]` 属性，即可判断该对象是否迭代，只有存在该属性的对象才可以迭代。例如：

```js
let arr = []
let obj = {}
console.log(arr[Symbol.iterator]) // ƒ values() { [native code] }
console.log(obj[Symbol.iterator]) // undefined
```

### 生成可迭代对象

将一个对象变为可迭代对象

```js
object = {a: 'a', b: 'b', c: 'c'}
object[Symbol.iterator] = function *(){
    let _keys = Object.keys(object)
    for(let i=0; i<_keys.length; i++){
        yield object[_keys[i]]
    }
}
```

迭代

```js
for(let value of object){
    console.log(value)
}
// 输出：a b c
```

其中的 `[Symbol.iterator]` 属性是一个 Symbol 类型的属性：

```js
Symbol.iterator
Symbol(Symbol.iterator)
```

### 默认内置可迭代对象

[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)、[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array)、[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map) 和 [`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 都是内置可迭代对象，因为它们的原型对象都拥有一个 [`Symbol.iterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) 方法。