---
title: 参数处理 & 解构赋值
date: 2019-12-01 18:32:01
tags:
  - JavaScript
  - ES6
---

## 函数剩余参数

使用 `arguments` 获取

```js
function sum(message){
  var result = 0
  for(var i = 1; i < arguments.length; i++){
    result += arguments[i]
  }
  return message + result
}
sum('结果是：', 1, 2, 3, 4) // 输出："结果是：10"
```

ES6 `...` 写法

```js
function sum(message, ...numbers){
  let result = 0
  for(let i=0; i<numbers.length; i++){
    result += numbers[i]
  }
  return message + result
}
sum('结果是：', 1, 2, 3, 4) // 输出："结果是：10"
```

上面的代码还可以使用 `.reduce()` 来简化循环的步骤。

```js
function sum(message, ...numbers){
  let result = numbers.reduce((p, v)=>p+v, 0)
  return message + result
}
sum('结果是：', 1, 2, 3, 4) // 输出："结果是：10"
```

`...` 也支持数组及及对象的合并，如下：

```js
let array1 = [1, 2, 3, 4, 5, 6]
let array2 = [0, ...array1, 7]
```

而在 ES5 之前，要完成上面的操作需要更复杂的方式

```js
let array1 = [1, 2, 3, 4, 5, 6]
let array2 = [0].concat(array1).concat([7])
```

## 数组解构赋值

ES6 新增了通过数组来赋值转换的功能

```js
let a = 1
let b = 2
;[a, b] = [b, a] // 此处要加分号，否则这行代码会向上变为一行
console.log('a: ' + a '，b: ' + b) // a: 2，b: 1
```

还可以结合 `...` 来批量赋值

```js
let [a, b, ...rest] = [10, 20, 30, 40, 50]
console.log(rest) // [30, 40, 50]
```

> 此处不能在 `...rest` 后再追加变量，剩余参数只能放在最后，否则会出现语法歧义。

还可以使用函数返回一个对象

```js
function fn() {
  return [1, 2]
}
let [a, b] = fn()
```

在赋值时还支持设置默认值

```js
let [a = 5, b = 7] = [1]
console.log(a, b) // 1 7
```

## 对象解构赋值

在 ES5 之前，对象批量赋值只能通过以下方式

```js
let sun = {name: 'isSun', age: 18, gender: 'Male'}
let name = sun.name
let age = sun.age
let gender = sun.gender
```

而 ES6 的新语法添加了通过对象来批量赋值

```js
let sun = {name: 'isSun', age: 18, gender: 'Male'}
let {name, age, gender} = sun
```

赋值时还可通过修改对象的属性名来修改变量名

```js
let sun = {
  name: 'Jack', age: 18, gender: 'Male'
}
let {name: serial} = sun
console.log(serial) // 输出：Jack
```

该方法还支持嵌套，如修改子对象的属性名

```js
let sun = {
  name: 'Jack',
  age: 18,
  gender: 'Male',
  child: {
    name: 'Tom', age: 6, gender: 'Male'
  }
}
let {child: {name: serial}} = sun
console.log(serial) // 输出：Tom
```

并且子对象赋值时也可添加默认参数（如果子对象没有该属性，则使用默认参数），同时子对象的属性也可以使用批量声明。

```js
let sun = {
  name: 'Jack',
  age: 18,
  gender: 'Male',
  child: {
    name: 'Jerry', age: 6, gender: 'Male'
  }
}
let { child: { name: serial='Tom', age, gender } } = sun
console.log(serial) // 输出：Jerry
console.log(age, gender) // 输出：6 "Male"
```

也可以根据同名 key 解构赋值

```javascript
({ a, b } = { a: "baz", b: 101 });
```

> 注意，此处需要用括号将它括起来，因为 Javascript 通常会将以 `{` 起始的语句解析为一个块。

## 设置函数默认值

### 基本写法

之前的写法

```js
function sum(a, b){
  a = a || 0
  b = b || 0
  return a + b
}
```

ES6 语法

```js
function sum(a = 0, b = 0){
  return a + b
}
```

### 设置对象的默认值

在 ES5 之前，设置默认值要经过一系列的判断

```js
function fn(options) {
  options = options === undefined ? {} : options;
  var size = options.size === undefined ? 'big' : options.size;
  var cords = options.cords === undefined ? { x: 0, y: 0 } : options.cords;
  var radius = options.radius === undefined ? 25 : options.radius;
  console.log(size, cords, radius);
  // now finally do some chart drawing
}

fn({
  cords: { x: 18, y: 30 },
  radius: 30
});
```

ES6 新语法将上面的写法简化为对象形式

```js
function fn({size = 'big', cords = { x: 0, y: 0 }, radius = 25} = {}) {
  console.log(size, cords, radius);
}
fn({
  cords: { x: 18, y: 30 },
  radius: 30
});
```

如果觉得复杂，还可以这么写

```js
function fn(options = {}) {
  let {size = 'big', cords = { x: 0, y: 0 }, radius = 25} = options
  console.log(size, cords, radius);
}

fn({
  cords: { x: 18, y: 30 },
  radius: 30
});
```

> 参考自 MDN 文档：[函数参数默认值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#函数参数默认值)

## 对象浅拷贝

浅拷贝通常指的是只会拷贝对象的第一层属性。使用 ES6 的两种语法都可以实现简单的浅拷贝

```js
let objA = {
  name: {
    x: 'a'
  }
}

let objB = Object.assign({}, objA)
console.log(objB) // {name: {x: "b"}}

let objC = {...objA}
console.log(objC) // {name: {x: "b"}}
```

上面两种语法还可以用来合并对象

```js
let objA = {
  p1: 1,
  p2: 2
}
let objB = {
  p1: 1250,
  p3: 3
}

let objC = Object.assign({}, objA, objB)
console.log(objC) // 输出：{p1: 1250, p2: 2, p3: 3}

let objD = {...objA, ...objB}
console.log(objD) // 输出：{p1: 1250, p2: 2, p3: 3}
```

## 对象属性加强

ES6 将变量赋值给对象的属性的语法简化了

```js
let x = 1
let y = 2
let obj = {x, y} // 等同于 let obj = {x: x, y: y}
console.log(obj) // {x: 1, y: 2}
```

并且支持对象的 key 在赋值时传入变量（ES5之前只能通过 `object[xxx]` 的方式传入变量）

```js
let key = 'x'
let value = 'y'
let object = {
  [key]: value
}
console.log(object) // {x: "y"}
```

中括号 (`[]`) 里还可以做简单的运算

```js
let key = 'x'
let value = 'y'
let obj = {
  [key + key]: value
}

console.log(obj) // {xx: "y"}
```
