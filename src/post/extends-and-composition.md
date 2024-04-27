---
title: 继承与组合
date: 2022-02-04T13:30:03+08:00
tags:
  - JavaScript
  - extends
  - composition
---

## 类的使用

用原生 JavaScript 声明一个类

```js
class Person {
  name;
  age;
  sayHi() {} // 共有函数
  playing = function () {} // 自有函数
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

new Person('Jack', 18)
// { name: 'Jack', age: 18, playing: ƒ () } [[Prototype]].sayHi()
```

使用 TypeScript 声明相同的类

```typescript
class Person {
  sayHi() {}
  playing = function () {}
  constructor(public name: string, public age: number) {}
}

new Person('Jack', 18)
// { name: 'Jack', age: 18, playing: ƒ () } [[Prototype]].sayHi()
```

## 继承（extends）

假设两个类 人类，报社，都继承了 事件发布/订阅的功能，但它们都有各自的功能（打招呼、打印）

```js
class EventEmitter {
  constructor() {}
  cache = []
  on() {}
  off() {}
  emit() {}
}

class Person extends EventEmitter {
  constructor() { super() }
  sayHi() {}
}

class 报社 extends EventEmitter {
  constructor() { super() }
  print() {}
}

const person = new Person()
const baoshe = new 报社()
```

## 多态（Polymorphism）

子类重写父类的属性，以实现多态

多态的意思是不同的子类对同一个消息有不同的反应，如 人类的 on 方法会比 报社 的 on 方法多一个 log 功能

```js
class Person extends EventEmitter {
  constructor() { super() }
  sayHi() {}
  on(eventName, fn) {
    console.log('我要监听了')
    super.on(eventName, fn)
  }
}

const person = new Person()
```

## 组合（composition）

使用组合实现继承的功能

```js
class Person {
  name;
  sayHi() {}
}

function mixin(value, other) {
  return Object.assign(value, other)
}

function createEmitter() {
  return {
    on() {},
    emit() {},
    off() {}
  }
}

let person1 = new Person('Jack')
mixin(person1, createEmitter())
// {name: undefined, on: ƒ, emit: ƒ, off: ƒ} [[Prototype]] sayHi: ƒ sayHi()
```

## 组合解决的问题

假如有猫、狗两个类，它们都有动物的特征

```js
dog
  .wangwang()
  .poop() // 拉屎
cat
  .miaomiao()
  .poop()
```

那么就可以写一个动物类，让猫、狗继承

```js
animal
  .poop()
    dog
      .wangwang()
    cat
      .miaomiao()
```

假如还有两种机器人，一个是打扫卫生机器人，一个是杀人机器人，它们都具有 ai 智能，并且一个可以清理垃圾，一个可以杀人

```js
cleaningRobot
  .ai()
  .clean()
MurderRobot
  .ai()
  .kill()

// 继承
Robot
  .ai()
    cleaningRobot
      .clean()
    MurderRobot
      .kill()
```

现在，要实现一个狗型杀人机器人（变态的需求总是不期而遇）

你会发现，用继承总是无法完美的实现该需求，因为继承不够灵活，如果它是狗，它就必须继承拉屎的功能，但是狗型杀人机器人是不需要拉屎的，它只需要汪汪、杀人、ai 智能。so，该需求需要用组合来实现

```js
// 不用 继承 实现 dog
const createWang = (state) => ({
  wangwang() {
    console.log(`汪汪，我是${state.name}`)
  }
})

const createPoop = (state) => ({
  poop() {
    console.log(`${state.name}拉屎了`)
  }
})

const createDog = (name) => {
  const state = { name }
  return Object.assign(
    {},
    createWang(state),
    createPoop(state)
  )
}

// 不用 继承 实现杀人机器人
const createAi = (state) => ({
  ai() { console.log(`${state.name}智能机器人`) }
})

const createKill = (state) => ({
  kill() { console.log(`${state.name}会杀人`) }
})

const createMurderRobot = (name) => {
  const state = { name }
  return Object.assign(
    {},
    createAi(state),
    createKill(state)
  )
}

// 不用 继承 实现狗型杀人机器人
const createMurderRobotDog = (name) => {
  const state = { name }
  return Object.assign(
    {},
    createWang(state),
    createAi(state),
    createKill(state)
  )
}

const dog = createDog('小白')
const murderRobot = createMurderRobot('小姜')
const murderRobotDog = createMurderRobotDog('Jack')
```

