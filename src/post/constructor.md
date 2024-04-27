---
title: 构造函数
date: 2020-09-17T20:58:21+08:00
tags:
  - function
  - Constructor
  - class
  - extends
---

## 构造函数（类）

创建一个简单的构造函数

```javascript
function Fn(name) {
  this.name = name
}
Fn.prototype.run = function() {
  console.log(this.name + '在跑')
}
let obj = new Fn('小张')
```

### new 做了什么

当 `let obj = new Fn('小张')` 执行时，做了以下事情

1. 创建一个空对象
2. 让 `this` 指向这个空对象
3. 让 `this.__proto__` 等于 `Fn.prototype`
4. 执行 `Fn.call(this, name)`
5. `return this`

> 参考文章：[JavaScript 的 new 到底是干什么的？](https://zhuanlan.zhihu.com/p/23987456?refer=study-fe)

## 原型的继承

实现一个基础的继承

```javascript
function Human(name) {
  this.name = name
}
Human.prototype.run = function() {
  console.log(this.name + '在跑')
}

function Man(name) {
  Human.call(this, name)
  this.gender = '男'
}
Man.prototype = new Human()

Man.prototype.fight = function() {
  console.log('糊你一脸')
}

let a = new Man('xxx')
console.log(a)
```

原本上面的代码就可以实现继承，但是在执行 `Man.prototype = new Human()` 时 `Human()` 被执行了，此时的 name 并没有传入 `new Human()` 中，所以你会发现在当前对象的原型 `Man.prototype` 上多了一个 `name: undefined` 属性，如下图所示

![图片](/images/function-new-prototype.jpg)

为了解决这个问题，可以放一个中间函数（Fn）用来存储 `Human.prototype` ，然后将 `Man.prototype = new Fn()`。这样既实现了原型链的继承，又不会执行 `Human()` 构造函数。

```javascript
function Human(name) {
  this.name = name
}
Human.prototype.run = function() {
  console.log(this.name + '在跑')
}

function Man(name) {
  Human.call(this, name)
  this.gender = '男'
}

let Fn = function() {}
Fn.prototype = Human.prototype
Man.prototype = new Fn()

Man.prototype.fight = function() {
  console.log('糊你一脸')
}

let obj = new Man('小明')
console.log(obj)
console.log(obj.__proto__ === Man.prototype) // true
console.log(obj.__proto__.__proto__ === Human.prototype) // true
```

## class

ES6 添加了 class，简化了构造函数的实现方式。每个类都要有一个 constructor 用来构造自有属性

```javascript
class Human {
  name;
  constructor(name) {
    this.name = name
  }
  // 共有属性
  run() {
    console.log(this.name + '再跑')
  }
}
```

### 实现原型继承（extends）

注意事项：

- 想要继承父类必须调用一次 super
- super 会将父类的属性传给子类
- 在调用 this 之前必须调用 `super()`，否则 this 所做的更改很可能不会生效。

```javascript
class Human {
  constructor(name) {
    this.name = name
  }
  run() {
    console.log(this.name + '再跑')
  }
}
class Man extends Human {
  constructor(name) {
    super(name)
    this.gender = '男'
  }
  fight() {
    console.log('糊你一脸')
  }
}
```

### 配合 `get`、`set` 使用

以下面的生物种类继承案例为例

```javascript
class Animal {
  constructor() {
    this.body = '身体'
    this._race = '动物'
  }
  move() {
    console.log("移动")
  }
  get race() {
    return this._race
  }
  set race(value) {
    this._race = value
  }
}
class Person extends Animal {
  constructor(name) {
    super()
    this.body = this.body + '四只蹄子'
    this.name = name
    this.age = 3
  }
  walk() {
    console.log("直立行走")
  }
}
const p1 = new Person('狗崽子')
p1.race = '犬科'
```

### 静态方法

在 class 构造函数中添加方法时在方法前添加 `static` 即可声明一个原型方法，可用通过直接 `原型.方法()` 的方式调用，如下：

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  static die() {
    console.log("歪比巴卜");
  }
}

Person.die();
```

上面的语法用函数表示就是这样

```javascript
function Person (name) {
  this.name = name
}

Person.die = function() {
  console.log("歪比巴卜");
};

Person.die();
```

注意，不论上面哪种方式，在构造函数上直接创建的方法都无法用它 `new` 出来的对象调用

```javascript
const object = new Person('小狗狗')
console.log(object) // { name: "小狗狗" }
```

> MDN 文档：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)

## `new.target`

**`new.target`** 属性允许你检测函数或构造方法是否是通过 [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符被调用的。在通过 [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符被初始化的函数或构造方法中，`new.target` 返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target` 的值是 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

函数调用中的 new.target

```typescript
function Fn() {
  if (!new.target) throw "请使用 new 初始化";
  console.log("已使用 new 初始化");
}

Fn(); // 请使用 new 初始化
new Fn(); // 已使用 new 初始化
```


构造方法中的 `new.target`

```typescript
class A {
  constructor() {
    console.log(new.target.name);
  }
}

let a = new A(); // logs "A"
```

## 立即执行函数

正常函数调用

```javascript
function fn() {
  console.log(1)
}
fn()
```

立即执行函数（匿名函数的调用）

```javascript
function (){
  console.log(1)
}()
```

但上面的语法在 JS 中是不被 JS 识别的，会报一个语法错误的错

解决方法：在函数前加 `!` 号，也可以使用 `+, -, ~, 1*` 等操作符的方式

```javascript
!(function() {
  console.log(1)
})()
```

> 注：上面的立即执行函数返回值是 `true` 因为原本函数没有给定返回值时的返回值默认是 `undefined` 。但添加了一个 `!` 号后取反，所以变成了 `true`

**立即执行函数的由来**

为了解决全局变量 以及 var 的变量提升带来的变量冲突，所以使用一个立即执行函数包裹需要执行的代码。

## 立即执行函数+闭包

::: info 概念

立即执行函数的作用主要是阻隔代码之前的作用域，而闭包通常跟立即执行函数一起使用，主要用于在立即执行函数外部访问立即执行函数中的变量及方法。通过立即执行函数+闭包的方法可以有效防止立即执行函数中的变量值被更改。

:::

假设我们要实现一个游戏，要实现关于「还剩几条命」的代码。但生命值不能让别人访问到，只能做生命加减操作，代码如下：

```javascript
!(function() {
  var lives = 50
  window.奖励一条命 = function() {
    lives += 1
    console.log(lives)
  }
  window.死一条命 = function() {
    lives -= 1
    console.log(lives)
  }
})()

window.奖励一条命() // 51
window.死一条命() // 50
```

## 函数节流

以游戏中的技能 CD 冷却时间为例，当一个技能处于 CD 状态时，你是无法释放技能的，但当 CD 时间过后，你就可以释放技能。

```javascript
function throttle(func, wait) {
  let timerId = null
  return function(...args){
    if (!timerId) {
      timerId = setTimeout(() => {
        clearTimeout(timerId)
        timerId = null
        func.apply(this, args)
      }, wait)
    }
  }
}
```

案例链接：https://jsbin.com/nokimeg/edit?html,js,output

## 函数防抖

这个就像带有吟唱时间的技能（回城），假如释放一个技能需要 3 秒，在你点击按钮后 3 秒，该技能才会释放，中途再次点击会重新计算吟唱时间。如下

```javascript
function debounce(func, wait) {
  let timerId
  return function (...args) {
    if (timerId) clearTimeout(timerId)

    timerId = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timerId)
      timerId = null
    }, wait)
  }
}
```

