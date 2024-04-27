---
title: 函数
date: 2020-09-17T20:58:21+08:00
tags:
  - JavaScript
  - function
  - this
---

## 函数是什么

![子程序](/images/function-routine.jpg)

> JavaScript 中只有**函数**和**方法**

## 闭包

闭包的特点

- 能让一个函数维持一个变量
- 但并不能维持这个变量的值
- 尤其是变量的值会变化时

例1

```js
let x = 'x'
let a = '1'
function f1(x) {
  return x + a
}
a = '3'
{
  let a = '2'
  f1('x') // 'x3'
}
a = '4'
```

例2

```js
let x = 'x'
let a = '1'
function f1(fn) {
  fn()
}

{
  let a = '2'
  function f2() {
    console.log(x + a)
  }
  f1(f2) // 'x2' 
}
```

for 循环中的闭包

```js
// 使用 var
for (var i = 0; i < 6; i++) {
  setTimeout(() => console.log(i))
}
// 6 6 6 6 6 6

// 使用 let
for (let i = 0; i < 6; i++) {
  setTimeout(() => console.log(i))
}
// 0 1 2 3 4 5
```

假如一个语言只支持闭包，不支持对象，那么可以用闭包实现对象

```js
function createPerson(age, name) {
  return function(key) {
    if (key === 'age') return age
    if (key === 'name') return name
  }
}

const person = createPerson(18, 'Jack')
person('age') // 18
person('name') // 'Jack'
```

## 声明函数

```js
const f1 = new Function('x', 'y', 'return x + y')
function f2(x, y) {
  return x + y
}
const f3 = function(x, y) {
  return x + y
}
const f4 = (x, y) => x + y
```

## 函数的特点

JavaScript 函数的有以下特点

- 有名字（匿名也可以）
- 支持闭包
- 创建函数作用域
- \* 有 arguments
- \* 有 this
- \* 支持 new 语法糖
- 是一个对象，有 name、length、call、apply、bind 属性
- 支持 0 ~ n 个参数，1 个返回值
- 即使参数相同，返回值也可能不同

带有 * 的都是箭头函数不支持的

```js
// 不支持 this
const f1 = () => console.log(this)
f1() // window
f1.call({ name: 'Jack' }) // window

// 不支持 arguments
const f2 = () => console.log(arguments)
f2() // Uncaught ReferenceError: arguments is not defined

// 不支持 new 运算符
const f3 = () => {}
new f3() // Uncaught TypeError: f3 is not a constructor
```

函数的 arguments 是当前传入参数组成的伪数组

```javascript
function fn(p1) {
  console.log(arguments)
}

fn(1, 2, 3) // [1, 2, 3]
```

## this

在 JavaScript 中，**全局 this** 通常包括如下情况

1. `this` 表示 window 对象（浏览器环境中）
2. `this` 表示 global 对象（Node.js/服务端环境）
3. `this` 表示 undefined（开启 `'use strict'`，也就是严格模式）

本质上函数是没有 `this` 的，`this` 只有在函数调用时才会传入（this 就是一个隐式参数）

```javascript
// 对象调用
const obj = {
  name: 'Jack',
  hi(p1, p2) { console.log(this.name, p1, p2) },
}
obj.hi(1, 2)
// 等价于
obj.hi.call(obj, 1, 2)

// 数组调用
const array = [function() { console.log(this) }, 'a']
array[0]()
// 等价于
array[0].call(array)
```

## 改变 `this` 的指向

call、apply、bind 都会改变 `this` 的指向，但它们的使用方式有一些略微去区别

```js
const obj1 = {
  name: '小李',
  fn(a, b) {
    console.log(this, a, b)
  },
}
const obj2 = { name: '小红' }

// call() 调用，第一个参数就是 this，后面的参数是函数的参数
obj1.fn.call(obj2, 1, 2) // {name: "小红"} 1 2

// apply() 调用，第一个参数还是 this，但其他参数需要以数组形式传入
obj1.fn.apply(obj2, [1, 2]) // {name: "小红"} 1 2

// bind() 绑定，返回一个修改 this 后的函数体，需要自己调用
let fnBind = obj1.fn.bind(obj2, 'a')
fnBind(1, 2) // {name: "小红"} "a" 1
```

## this 相关考题

例1

```js
button.onclick = function() {
  console.log(this)
}
// this 是参数，button 是错误的

const vm = new Vue({
  data: {
    message: ''
  },
  methods: {
    sayHi() {
      console.log(this.message)
    }
  }
})
// this 由运行时环境决定
```

例2

```js
let length = 10
function fn() {
  console.log(this.length)
}

let obj = {
  length: 5,
  method(fn) {
    fn()
    arguments[0]()
  }
}

obj.method(fn, 1) // 输出什么，有很多坑
```

## 递归

一个简单的递归阶乘

```js
const j = (n) => n === 1 ? 1 : n * j(n - 1)

j(4) // 24

// 代入法求值
j(4)
= 4 * j(3)
= 4 * (3 * j(2))
= 4 * (3 * (2 * j(1)))
= 4 * (3 * (2 * 1))
= 4 * (3 * 2)
= 4 * 6
= 24
```

斐波那契数列

```js
f = () =>
  n === 0 ? 0 :
  n === 1 ? 1 :
  f(n - 1) + f(n - 2)

f(4) // 3

// 代入法求值
f(4)
= f(3) + f(2)
= (f(2) + f(1)) + (f(1) + f(0))
= ((f(1) + f(0)) + f(1)) + (1 + 0)
= ((1 + 0) + 1) + 1
= (1 + 1) + 1
= 3
```

递归调用有一个问题，就是每次调用都会有一个调用栈，用来记录当前调用的函数，如果需要记忆的函数过多，就会爆栈

## 如何降低压栈/计算次数

使用尾递归优化（tail recursion） 或 记忆化函数（memo）

## 尾递归

在函数的尾巴（return）进行递归

使用迭代代替递归实现 阶乘

```js
const j = (n) => n === 1 ? 1 : j_inner(n, 2, 1)

const j_inner = (number, start, prev) => {
  return start === number ? start * prev
    : j_inner(number, start + 1, start * prev)
}
```

使用迭代实现 斐波那契数列

```js
const f = (n) => f_inner(2, n, 1, 0)

const f_inner = (start, end, prev1, prev2) =>
  start === end ? prev1 + prev2
    : f_inner(start + 1, end, prev1 + prev2, prev1)
```

但，在 JavaScript 中，即使做了尾递归，代码也不会优化多少，依然会存在爆栈问题（JavaScript 没有做函数尾递归优化）

解决方法：将递归都改为循环

## 循环

循环的优点就是可以提高运算效率，并且不会爆栈

使用循环实现 阶乘

```js
const j = (n) => {
  let temp = 1
  for (let i = 2; i <= n; i++) {
    temp = temp * i
  }
  return temp
} 
```

使用循环实现 斐波那契数列

```js
const f = (n) => {
  const array = [0, 1]
  for (let i = 0; i <= n - 2; i++) {
    array[i + 2] = array[i] + array[i + 1]
  }
  return array[array.length - 1]
}
```

## 记忆化

实现一个简单的记忆化函数

```js
const memo = (fn) => {
  let params = [] 
  return function(arg) {
    if (params[0] === arg) {
      return params[1]
    }
    params[0] = arg
    params[1] = fn(arg)
    return params[1]
  }
}

const x2 = memo((x) => {
  console.log('执行了一次')
  return x * 2
})

// 第一次调用 x2(1)
console.log(x2(1)) // 打印出执行了，并且返回2
// 第二次调用 x2(1)
console.log(x2(1)) // 不打印执行，但返回了上次的结果2
// 第三次调用 x2(1)
console.log(x2(1)) // 不打印执行，但返回了上次的结果2
```

Lodash 是如何实现记忆化函数的

```js
_.memoize = function(func, hasher) {
  var memoize = function(key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key)
    if (!has(cache, address))
      cache[address] = func.apply(this, arguments)
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}
```

记忆化函数可以减少重复计算（大大降低压栈的次数）

### React.memo 减少计算

案例地址：https://codesandbox.io/s/gallant-poitras-nvv63

### React 解决 onClick 每次都会重新创建

解决方案

- 自己解决，只要 m 不变，就返回相同的函数，m 变了再创建新函数
- 用 useCallback：https://codesandbox.io/s/distracted-herschel-muxk1

## 柯里化（Currying）

让所有函数只接受一个参数

### 单参数函数接收两个参数

```js
// 用对象形式
const add = ({a, b}) => a + b

// 用柯里化
const add = a => b => a + b
```

> 感觉有点不方便？没错，如果你没有接受函数式的一整套理论，你就没必要用柯里化

### 柯里化一个函数

把一个多参数函数，变成单参数函数

把 `add(1, 2, 3)` 变为 `curriedAdd(1)(2)(3)`

```js
const curriedAdd = a => b => c => add(a, b, c)
```

难度升级，假设

- addTwo 接受两个参数
- addThree 接受三个参数
- addFore 接受四个参数

请写出一个 currify 函数，使得它分别接受 2、3、4 次参数，比如

```js
currify(addTwo)(1)(2) // 3
currify(addThree)(1)(2)(3) // 6
currify(addFore)(1)(2)(3)(4) // 10
```

也就是说，currify 能将任意接受固定个参数的函数，变成单一参数的函数（柯里化）

```js
const currify = (fn, params = []) => (...args) =>
  params.length + args.length === fn.length
    ? fn(...params, ...args)
    : currify(fn, [...params, ...args]) 
```

使用

```js
const addTwo = (a, b) => a + b
const addThree = (a, b, c) => a + b + c
const addFore = (a, b, c, d) => a + b + c + d

const f1 = currify(addTwo)
f1(1)(2) // 3

const f2 = currify(addThree)
f2(1)(2)(4) // 7

const f3 = currify(addFore)
f3(1)(2)(4)(5) // 12
```

## 高阶函数

把函数作为参数或返回值的函数

JavaScript 内置的高阶函数

```js
Function.prototype.bind
Function.prototype.apply
Function.prototype.call

Array.prototype.sort
Array.prototype.map
Array.prototype.filter
Array.prototype.reduce

// 它们都可以转换为 call 的方式调用
const fn = (p1, p2) => console.log(this, p1, p2)
const bind = Function.prototype.bind
bind.call(fn, {name: 'Jack'}, 1, 2)
```

## 函数的组合

使用函数组合处理字符串

```js
function doubleSay(str) {
  return str + ", " + str
}
function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1)
}
function exclaim(str) {
  return str + '!'
}
let result = exclaim(capitalize(doubleSay("hello")))
result // => 'Hello, hello!'
```

## 使用 pipe 操作符

```js
let result = 'hello'
  |> doubleSay
  |> capitalize
  |> exclaim

result // => "Hello, hello!"
```

马上这个语法就可以使用了

如果你现在就想使用，可以使用 Ramda.js：https://codesandbox.io/s/quirky-black-frtjl

```js
import * as R from "ramda";

const say = R.compose(
  doubleSay,
  capitalize,
  exclaim
);
let result = say("hello");
console.log(result); //=> "Hello, hello!"
```

## React 高阶组件

定义：React 中的高阶组件通常指的就是 class 组件，但此处的高阶组件指的是可以传入一个函数的组件

示例代码：https://codesandbox.io/s/nifty-butterfly-tgs28

- children 是一个函数
- children 返回 React 元素
- 把需要暴露的 API 传给 children
- 其实就是回调函数

## 总结

理解函数需要

- 搞清楚函数所有特点
- 理解递归
- 理解迭代
- 理解 memorize
- 理解组合函数