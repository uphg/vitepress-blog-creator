---
title: Funt - 函数封装
date: 2022-01-05T10:09:07+08:00
tags:
  - JavaScript
---

## 函数防抖

首先用 setTimeout 实现一个最简单的防抖函数

```js
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

underscore 的防抖函数，主要做了性能的优化

```js
const now = Date.now

function debounce(func, wait) {
  let timerId, context, prev, result, args

  const later = function () {
    clearTimeout(timerId)
    const passed = now() - prev

    // 对比两次执行的时间间隔是否小于 wait
    // 小于就设置一个执行剩余时间的 setTimeout
    if (wait > passed) {
      timerId = setTimeout(later, wait - passed)
    } else {
      timerId = null
      result = func.apply(context, args)

      // 避免 func 递归调用 debounced 时清除内容
      if (!timerId) args = context = null
    }
  }

  const debounced = function (..._args) {
    context = this
    args = _args
    prev = now()

    if (!timerId) {
      timerId = setTimeout(later, wait)
    }

    return result
  }

  return debounced
}
```

上面的代码，相较于最简单的版本，优化了 setTimeout 部分，只会在第一次触发防抖时设置一个 setTimeout，之后每次触发防抖只会记录触发的时间，当 setTimeout 执行时，再根据当前时间与触发时间差判断是否大于节流时间，做进一步处理。

添加 immediate 选项，immediate 表示是否立即触发，如果为 true 表示当前函数立即调用，之后再防抖，如果为 false，表示当前函数在防抖间隔的指定时间后调用

```js
const now = Date.now

function debounce(func, wait, immediate = false) {
  let timerId, context, prev, result, args

  const later = function () {
    clearTimeout(timerId)
    const passed = now() - prev

    // 对比两次执行的时间间隔是否小于 wait
    // 小于就设置一个执行剩余时间的 setTimeout
    if (wait > passed) {
      timerId = setTimeout(later, wait - passed)
    } else {
      timerId = null
      if (!immediate) result = func.apply(context, args)

      if (!timerId) args = context = null
    }
  }

  const debounced = function (..._args) {
    context = this
    args = _args
    prev = now()

    if (!timerId) {
      timerId = setTimeout(later, wait)
      if (immediate) result = func.apply(context, args)
    }

    return result
  }

  // 可手动终止定时器
  debounced.cancel = function() {
    clearTimeout(timerId)
    timerId = args = context = null
  }

  return debounced
}
```

## 函数节流

使用 setTimeout 实现一个最简单的节流

```js
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

underscore 的节流函数，主要添加了首次触发时的回调（leading）和最后一次触发后的延时回调选项（trailing）

首先看不附带选项功能的代码

```js
const now = Date.now

function throttle(func, wait) {
  let context, args, result, timerId
  let prev = 0

  const later = function () {
    clearTimeout(timerId)

    prev = now()
    timerId = null
    result = func.apply(context, args)
  }

  const throttled = function (..._args) {
    const _now = now()

    // 计算每次触发的剩余时间
    const remaining = wait - (_now - prev)
    context = this
    args = _args

    // 如果剩余时间小于等于 0，表示当前时间与上一次时间间隔超过了 wait
    // 如果剩余时间大于 wait，表示系统时间设置错误（_now - prev 等于复数的情况）
    // 上面两次的条件都会立即调用 func（如果之前有定时器，清除了再调用）
    if (remaining <= 0 || remaining > wait) {
      if (timerId) {
        clearTimeout(timerId as number)
        timerId = null
      }

      prev = _now
      result = func.apply(context, args)
      // 如果不存在 timerId，并且当前时间间隔小于 wait
      // 就设置一个定时器，时间为剩余时间（remaining）
    } else if (!timerId) {
      timerId = setTimeout(later, remaining)
    }

    return result
  }

  return throttled
}
```

执行流程

- 第一次触发必定会走进 `remaining <= 0` 条件
- 第二次触发会走 `!timerId` 条件，添加一个剩余时间（remaining）的定时器
- 后面的触发如果小于节流时间（wait）就什么都不做，
- 如果大于节流时间，就会使得 remaining 为负，走 `remaining > wait` 条件，如此循环

添加选项功能（leading、trailing）的代码

```js
const now = Date.now

function throttle(func, wait, { leading = true, trailing = true } = {}) {
  let context, args, result, timerId
  let prev = 0

  const later = function () {
    clearTimeout(timerId)

    prev = now()
    timerId = null
    result = func.apply(context, args)
  }

  const throttled = function (..._args) {
    const _now = now()

    // 如果 leading 为 false，并且 prev 为 0
    // 就让 prev 等于当前时间，用于记录节流间隔首次的触发时间
    if (!prev && !leading) prev = _now

    const remaining = wait - (_now - prev)
    context = this
    args = _args

    if (remaining <= 0 || remaining > wait) {
      if (timerId) {
        clearTimeout(timerId as number)
        timerId = null
      }

      prev = _now
      result = func.apply(context, args)

      // 如果不存在 timerId，且当前时间间隔小于 wait，
      // 且 trailing 为 true（默认）表示需要延时调用
      // 就设置一个定时器，时间为剩余时间（remaining）
    } else if (!timerId && trailing) {
      timerId = setTimeout(later, remaining)
    }

    return result
  }

  return throttled
}
```
