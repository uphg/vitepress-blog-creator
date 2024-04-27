---
title: Event Loop
date: 2022-02-03T19:48:27+08:00
tags:
  - JavaScript
  - Event Loop
  - process.nextTick()
---

当 JavaScript 执行一个异步任务的时候（如：AJAX），JavaScript 什么都不会做，它只会通知 C++（单线程），C++ 通过轮询来查看延时任务什么时候完成，完成了再通知 JavaScript 继续执行该任务。EventLoop 就是 C++ 如何通过轮询执行 JavaScript 异步任务（也可以说 C++ 轮询执行 JavaScript 异步任务的规则）

**所以，EventLoop 主要讲事件循环的每个阶段和变化的过程**

## Event Loop 的各个阶段

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

Node.js 执行时，会

1. 开启 EventLoop
2. 执行 JavaScript 代码

但是执行的顺序不一定是依次的，因为它们是两个不同的进程，可能有时候会 EventLoop 先被开启，有时候会 JavaScript 代码 先被执行

## setImmediate() & setTimeout()

setImmediate 和 setTimeout 很相似，但是其回调函数的调用时机却不一样。

setImmediate() 的作用是在当前 poll 阶段结束后（check 阶段）调用一个函数。setTimeout() 的作用是在一段时间后（timers 阶段）调用一个函数。 这两者的回调的执行顺序取决于 setTimeout 和 setImmediate 被调用时的环境。

举例来说，如果在主模块中运行下面的脚本，那么两个回调的执行顺序是无法判断的：

```js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

如果第一次运行 Event Loop 进程先被执行，那么先执行的就是 setImmediate（JavaScript 还没有运行，timers 阶段还没有存储 setTimeout 的回调函数，所以 Event Loop 会进入到 poll 阶段，再进入 check 阶段，再回到 timers 阶段）

如果第一次运行 JavaScript 进程先被执行，那么先执行的就是 setTimeout（此时 JavaScript 已经运行，再运行 Event Loop 时，timers 阶段已经存储了 0 毫秒后执行的 setTimeout ，会立即执行 setTimeout ，再进入 poll 阶段）

但是，如果将上面的代码放到一个异步操作中，那么 setImmediate 一定是优先执行的，因为异步操作一定是在第一次运行之后执行（从 poll 阶段开始运行）

```js
setTimeout(() => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);

  setImmediate(() => {
    console.log('immediate');
  });
})

// immediate
// timeout
```

## process.nextTick()

从技术上来讲 `process.nextTick()` 并不是 event loop 的一部分。不管 event loop 当前处于哪个阶段，nextTick 队列都是在当前阶段（poll 阶段）后就被执行了。

```js
setTimeout(() => {
  setTimeout(() => console.log('timeout'))
  setImmediate(() => console.log('immediate'))
  process.nextTick(() => console.log('nextTick'))
})

// nextTick
// immediate
// timeout
```

但是，如果把 `process.nextTick()` 放在一个异步任务中，它就总是会在当前异步任务的代码之后执行

```js
setTimeout(() => {
  setTimeout(() => {
    console.log('timeout')
    process.nextTick(() => console.log('async nextTick'))
  })
  setImmediate(() => console.log('immediate'))
  process.nextTick(() => console.log('nextTick'))
})

// nextTick
// immediate
// timeout
// async nextTick
```

## 宏任务 & 微任务

Node.js 

- setTimeout -> timers 阶段（很像宏任务）
- setImmediate -> check 阶段（很像宏任务）
- nextTick -> 当前任务执行完成后立即执行（很像微任务）
- `promise.then()` -> 实现原理与 nextTick 相同，但是 promise 必须要在 `resolve()` 执行后才会把当前 `.then()` 中的函数放入任务队列中

Chrome 浏览器

Chrome 浏览器中执行 JavaScript 有两个任务队列，一个是宏任务（等一会再执行），宏任务是在当前代码执行后等待指定时间后执行，如 setTimeout。一个是微任务（马上执行），微任务是再当前 JavaScript 代码执行后立即执行，如 `promise.then()` （`resolve()`调用后）

## 相关代码题

setImmediate & setTimeout

```js
setImmediate(() => {
  console.log('setImmediate1')
  setTimeout(() => {
    console.log('setTimeout1')
  })
})

setTimeout(() => {
  console.log('setTimeout2')
  setImmediate(() => {
    console.log('setImmediate2')
  })
})
```

Promise async

```js
async function async1() {
  console.log(1)
  await async2() // 相当于 Promise.resolve(async2()).then(() => console.log(2))
  console.log(2)
}

async function async2() {
  console.log(3)
}

async1()

new Promise(function (resolve) {
  console.log(4)
  resolve()
}).then(function () {
  console.log(5)
})
```

## 参考文章

- [Event Loop、计时器、nextTick](https://juejin.cn/post/6844903582538399752)
- [The Node.js Event Loop, Timers, and `process.nextTick()`](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

