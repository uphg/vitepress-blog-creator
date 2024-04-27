---
title: JS 的缺陷
date: 2021-01-03T13:12:31+08:00
tags:
  - JavaScript
  - JS的缺点
---

## JS 的BUG

1. 字符串相加运算方式歧义，将 `+ "a"` 转为 `NaN`
  ```js
  "b" + "a" + + "a" + "a"
  ```
  答案：`"baNaNa"`

2. `document.all` 是一个对象，但又同时是一个 `undefined`（IE 时代区分 IE 浏览器的 API）
3. 数组相加会先转成字符串。
  ```js
  [1, 2, 3] + [4, 5, 6]
  ```
  答案：`"1,2,34,5,6"`
4. 月份以 0 开始计算
  ```js
  d = new Date('2020-04-01')
  d.getMonth()
  ```
  答案：`3`
5. sort 默认会按照字典排序。
  ```js
  [1, 2, 3, 15, 30, 7, 5, 45, 60].sort()
  ```
  答案：`[1, 15, 2, 3, 30, 45, 5, 60, 7]`
6. JS 无法分辨 `null` 是否为对象
  ```js
  typeof null // object
  null instanceof object // false
  ```
7. 转换数组 API 过长（ES6已解决）
  ```js
  Array.prototype,slice.call(
    { 0: 'a', 1: 'b', 2: 'c', length: 3}
  )
  ```

### 特别篇之 `==`

两个等于号会出现很多歧义的相等。

```js
[] == ![]                // true

!!"false" == !!"true"    // true

true == "true"           // false
false == "false"         // false

!![]                     // true
[] == true               // false

!!null                   // false
null == false            // false
```


## JS 的正常化内容

```js
typeof NaN === 'number' // true
0.1 + 0.2 !== 0.3       // true
```

大部分语言都不会兼容小数的准确相加，详情参考网站：[https://0.30000000000000004.com/](https://0.30000000000000004.com/)

## ES6 的缺点

箭头函数无法自动返回对象（Object），它会将对象解析为块级作用域。

```js
a = () => [1, 2, 3]
a() // [1, 2, 3]
f = () => {a: 1}
f() // undefined
```

可以用如下写法解决：

```js
f = () => ({a: 1})
f() // {a: 1}
```