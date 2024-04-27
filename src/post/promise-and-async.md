---
title: Promise 对象 & async 函数
date: 2020-05-27T19:30:16+08:00
tags:
  - JavaScript
---

## Promise & setTimeout 的执行顺序

经典的面试题

```js
setTimeout(() => console.log(1))

const fn = () => new Promise(resolve => {
  resolve()
  console.log(2)
}).then(() => {
  console.log(3)
})

fn()
console.log(4)

// 执行顺序：2 -> 4 -> 3 -> 1
```

- 一开始 JavaScript 中是没有 Promise 的，只有 setTimeout 这种异步任务
- setTimeout 是放在宏任务队列中执行
- 后来 ES6 规范添加了 Promise，但是 Promise 需要在 setTimeout 之前执行
- 于是就添加了微任务队列专门用来执行 Promise，Promise 执行完成后再去宏任务队列执行 setTimeout

## 回调地狱

Promise 主要的作用就是解决回调地狱，所以在这里举例解释一下回调地狱以及回调。

普通回调函数（回调地狱）

```js
function move(fn) {
  fn()
}

// 把一个大象放进冰箱分几步
move(() => {
  console.log('1. 打开冰箱门')
  move(() => {
    console.log('2. 把大象放进去')
    move(() => {
      console.log('3. 关上冰箱门')
    })
  })
})
```

使用 Promise 的回调函数

```js
function move() {
  return new Promise(function (resolve, reject) {
    resolve()
  })
}

// 把一个大象放进冰箱分几步
move()
  .then(() => { console.log('1. 打开冰箱门') })
  .then(() => { console.log('2. 把大象放进去') })
  .then(() => { console.log('3. 关上冰箱门') })
```

> 相比回调函数的优点：虽然 Promise 封装起来有些麻烦，但在调用时，相比回调地狱，结构更清晰。

## Promise 的链式调用

- **链式调用的用法**

  一个函数 `return` 一个 `new Promise` 对象，对象中传入一个函数，函数有两个参数 `function(resolve, reject) {}` 这个函数就可以进行链式调用

- **链式调用的规则**

  只要上一个 `.then(resolve, reject)` 不抛出错误，接下来的 `.then(resolve, reject)` 都会执行 resolve ，否则就执行 reject

### 基本案例

首先创建一个 `Promise` 函数，如果传入的值不是 200 就会执行失败

```js
function fn(params) {
  return new Promise(function(resolve, reject) {
    if (params === 200) {
      resolve()
    } else {
      reject()
    }
  })
}
```

第一次 `.then()` 成功（resolve）后抛出错误

```js
fn(200)
  .then(
    () => { console.log('成功1'); throw '抛出错误' },
    () => { console.log('失败1') }
  )
  .then(
    () => { console.log('成功2') },
    () => { console.log('失败2') }
  )
// 成功1
// 失败2
```

第一次 `.then()` 失败（reject）后抛出错误

```js
fn(404)
  .then(
    () => { console.log('成功1') },
    () => { console.log('失败1'); throw '抛出错误' }
  )
  .then(
    () => { console.log('成功2') },
    () => { console.log('失败2') }
  )
// 失败1
// 失败2
```

第一次 `.then()` 成功（resolve）后连续调用 `.then()`

```js
fn(200)
  .then(
    () => { console.log('成功1') },
    () => { console.log('失败1') }
  )
  .then(
    () => { console.log('成功2') },
    () => { console.log('失败2') }
  )
  .then(
    () => { console.log('成功3') },
    () => { console.log('失败3') }
  )
// 成功1
// 成功2
// 成功3
```

第一次 `.then()` 失败（reject）后连续调用 `.then()`

```js
fn(404)
  .then(
    () => { console.log('成功1') },
    () => { console.log('失败1') }
  )
  .then(
    () => { console.log('成功2') },
    () => { console.log('失败2') }
  )
  .then(
    () => { console.log('成功3') },
    () => { console.log('失败3') }
  )
// 失败1
// 成功2
// 成功3
```

如果想要改变后续 `.then()` 的结果，比如一定要执行的 成功（resolve）/失败（reject），可以在当前 `.then()` 执行的函数中再次 `return` 一个 Promise，来指定下次 `.then()` 执行的结果。

```js
fn(404)
  .then(
    () => { console.log('成功1') },
    () => {
      console.log('失败1')
      return new Promise(function(undefined, reject){
        reject('执行 reject')
      })
    }
  )
  .then(
    () => { console.log('成功2') },
    (params) => {
      console.log(params)
      console.log('失败2')
    }
  )

// 结果：
// 失败1
// 执行 reject
// 失败2
```

## Promise.reject()

`Promise.reject()` 方法返回一个执行失败的 Promise 对象。

```js
const rejectFn = () => Promise.reject('执行 reject')

rejectFn().then((params) => {
  console.log('成功')
  console.log(params)
}, (params) => {
  console.log('失败')
  console.log(params)
})

// 失败
// 执行 reject
```

使用 reject 改变 `.then()` 的执行结果

```js
fn(404)
  .then(
    () => { console.log('成功1') },
    () => {
      console.log('失败1')
      return Promise.reject('执行 reject')
    }
  )
  .then(
    () => { console.log('成功2') },
    (params) => {
      console.log(params)
      console.log('失败2')
    }
  )
// 输出：
// 失败1
// 执行 reject
// 失败2
```

## Promise.resolve()

`Promise.resolve(value)` 方法返回一个执行成功的 Promise 对象。

```js
const promiseResolve = () => Promise.resolve(123);

promiseResolve().then((value) => {
  console.log('成功')
  console.log(value);
}, (value) => {
  console.log('失败')
  console.log(value)
})

// 输出：
// 成功
// 123
```

**不要使用 resolve 调用如下格式的对象，会造成死循环**

```js
let thenable = {
  then: (resolve, reject) => {
    resolve(thenable)
  }
}

Promise.resolve(thenable)  //这会造成一个死循环
```

## Promise.prototype.catch()

除了 `.then()` Promise 还有一个 `.catch()` 方法，也可以处理错误，相当于 `.then()` 的语法糖

```js
fn(404).catch(() => {
  console.log('错误')
})
```

上面的代码相当于这样执行 `.then()`

```js
fn(404).then(undefined, () => {
  console.log('错误')
})
```

`.catch()` 捕获错误的顺序和 `.then()` 是相同的，也是处理上一次的结果

```js
fn(200)
  .then(
    () => { console.log('成功1'); throw '抛出错误' },
    () => { console.log('失败1') }
  ).catch((error) => {
    console.log(error)
})
```

::: tip 注意

**catch()** 方法返回一个[Promise](https://developer.mozilla.org/zh-CN/docs/Web/API/Promise)，并且处理拒绝的情况。它的行为与调用[`Promise.prototype.then(undefined, onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 相同。 (事实上, calling `obj.catch(onRejected)` 内部calls `obj.then(undefined, onRejected)`).

:::

## Promise.prototype.finally()

`.finally()` 同样是 `.then()` 的语法糖，它表示不论上次的结果成功还是报错，都执行相同的函数

```js
function f1() {
  console.log('已处理')
}

fn(200).finally(f1) // 已处理

fn(404).finally(f1) // 已处理，但会提示报错 [Uncaught (in promise) undefined]
```

上面的代码等同于这样执行 `.then()`

```js
function f1() {
  console.log('已处理')
}

fn(200).then(f1, f1)

fn(404).then(f1, f1)
```


## Promise.all()

`Promise.all(iterable)` 接受一个可迭代对象，数组内可以包括多个 Promise ，只有所有 Promise 都请求成功（不抛出错误），才会执行 `.then()` 的成功函数（resolve）并返回一个与传入数组对应结果的数组。只要有一个失败，就执行（reject）失败的原因是第一个失败的 Promise 的结果。

```js
const fn = (value) => new Promise((resolve, reject) => {
  if (value === 200) {
    resolve('成功')
  } else {
    reject('失败')
  }
})

Promise.all([fn(200), fn(404), fn(200)]).then(
  (data) => {
    console.log(data)
  },
  (error) => {
    console.log(error)
  }
)

// 输出：失败
```

## Promise.allSettled()

`Promise.allSettled(iterable)` 与 all 方法相似。接受一个可迭代的对象，例如 Array，其中每个成员都是一个 Promise 对象。

返回所有给定的 Promise 执行成功或失败后的结果列表对象

```js
const fn = (value) => new Promise((resolve, reject) => {
  if (value === 200) {
    resolve('成功')
  } else {
    reject('失败')
  }
})

Promise.allSettled([fn(200), fn(404), fn(404)]).then(
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
)

// 输出：
// [
//   {status: 'fulfilled', value: '成功'}
//   {status: 'rejected', reason: '失败'}
//   {status: 'rejected', reason: '失败'}
// ]
```

自己实现一个 `Promise.allSettled`

```js
const resolvePromises = (promiseList) => {
  return promiseList.map(promise => {
    return promise.then(
      (value) => ({ status: 'ok', value }),
      (reason) => ({ status: 'not ok', reason })
    )
  })
}

// 封装 Promise.allSettled2
Promise.allSettled2 = (promiseList) => {
  return Promise.all(resolvePromises(promiseList))
}

const fn = (value) => new Promise((resolve, reject) => {
  if (value === 200) {
    resolve('成功')
  } else {
    reject('失败')
  }
})

// 使用 allSettled2 调用 fn 函数
Promise.allSettled2([fn(200), fn(404), fn(404)]).then(
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
)

// 输出：
// [
//   {status: 'ok', value: '成功'},
//   {status: 'not ok', reason: '失败'},
//   {status: 'not ok', reason: '失败'}
// ]
```

## Promise.race()

race 请求失败的处理方式与 all 相同，不同的地方是 race 只要有一个函数请求成功就会返回成功函数（resolve），返回的数据是第一个成功函数的数据。

成功案例

```js
const fnp = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 500);
});

Promise.race([fnp, fnp, fnp]).then(
  (data) => {
    console.log("请求成功");
  },
  (error) => {
    console.log("请求失败");
  }
);
```

失败案例

```js
function fn(params) {
  return new Promise(function(resolve, reject){
    const hash = ['第0个', '第1个', '第2个', '第3个']
    if(hash[params]){
      resolve(hash[params])
    } else {
      reject('失败')
    }
  })
}

Promise.race([fn(1), fn(4), fn(1)]).then(response => {
  console.log(response)
}) // 第一个

Promise.race([fn(4), fn(1), fn(1)]).then(response => {
  console.log(response)
}) // Uncaught (in promise) 失败
```

## async 函数

### 基本案例

使用 `async` 声明一个函数，在函数中执行 `await` 语句，就是 `async` 函数

```js
function fn(params) {
  return new Promise(function(resolve, reject){
    if (params === 200) {
      resolve('成功')
    } else {
      reject('失败')
    }
  })
}

async function getData() {
  let a = await fn(200)
  console.log(a) // 成功
}

getData()
```

上面的 `getData()` 会返回一个 `Promise` 对象，如下

```js
const a = getData()
console.log(a) // Promise {<pending>}
```

`await` 配合 `Promise.all()` 使用

```js
async function getData() {
  let a = await Promise.all([fn(200), fn(200), fn(200)])
  console.log(a)
}

getData() // ["成功", "成功", "成功"]
```

`await` 配合 `Promise.race()` 使用

```js
async function getData() {
  let a = await Promise.race([fn(200), fn(404), fn(200)])
  console.log(a)
}

getData() // "成功"
```

## 使用循环执行 await

使用 for 循环执行 await 运行结果为串行（后面的等前面）

```js
async function runPromise(myPromises) {
  for (let i = 0; i < myPromises.length; i++) {
    await myPromises[i]()
  }
}

const createPromise = (time, id) => () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log('promise', id)
      resolve()
    }, time)
  )
runPromise([
  createPromise(3000, 4),
  createPromise(2000, 2),
  createPromise(1000, 1)
])

// 输出：
// promise 4
// promise 2
// promise 1
```

使用 forEach 循环执行 await 运行结果为并行（后面的不等前面的）

```js
async function runPromise(myPromises) {
  myPromises.forEach(async (task) => {
    await task()
  })
}

const createPromise = (time, id) => () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log('promise', id)
      resolve()
    }, time)
  )

runPromise([
  createPromise(3000, 4),
  createPromise(2000, 2),
  createPromise(1000, 1)
])

// 输出：
// promise 1
// promise 2
// promise 4
```

## async 捕获错误

使用 try catch 捕获错误

```js
async function getUserinfo() {
  try {
    const response = await axios.get('/xxx')
  } catch(error) {
    error.response && console.log(error.response.message)
    throw error
  }
}
```

更好的方法是使用 `.catch()`

```js
async function getUserinfo() {
  const response = await axios.get('/xxx').catch(errorHandler)
}
```

errorHandler 错误处理函数封装

```js
function errorHandler(error) {
  if (error.response) {
    // 请求已发出，服务器响应
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // 请求已发出，但未收到响应
    console.log(error.request);
  } else {
    // 触发错误的请求
    console.log('Error', error.message);
  }
  console.log(error.config);
}
```

## 代码题

使用 await 做加法运算

```js
let a = 0
let test = async () => {
  a = a + await 10
  console.log(a)
}
test()
console.log(++a)

// 输出：
// 1
// 10
```

> 原理：test 函数在运行时就已经获取 a 的值了（`0`），即使它是异步的，异步内容也只在 await 后。

在上面的代码中添加一个 a 的 log（逗号不会影响运行结果）

```js
let a = 0
let test = async () => {
  a = (console.log(`a: ${a}`), a) + await 10
  console.log(a)
}
test()
console.log(++a)

// 输出：
// a: 0
// 1
// 10
```

结果一样，但是通过 log 可以得知，在 `a + await 10` 时，a 依然是 `0`

## 参考文章

- [Axios 作弊表（Cheat Sheet）](https://juejin.cn/post/6844903569745788941)
- [async/await 之于 Promise，正如 do 之于 monad（译文）](https://juejin.cn/post/6844903842723659790)