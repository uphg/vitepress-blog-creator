---
title: 浏览器模型
date: 2020-05-22T19:43:52+08:00
tags:
  - HTTP
  - LocalStorage
---

## window.JSON

::: tip 注意

由于 JSON 只支持对象、数组、数值、字符串、布尔值和 `null` ，所以 `window.JSON` 只适用于。如果强行转换其他类型，如：日期、正则、函数、循环、引用类型的对象，或者带有 `undefined` 的对象，则会抛出一个错误。

:::

### JSON.parse

- **作用：**

  将符合JSON语法的字符串转换成JS对应的数据类型（JSON字符串 => JS 数据）

  ```js
  let object
  try {
      object = JSON.parse(`{'name':'frank'}`)
  }catch(error){
      console.log('出错了，错误详情是')
      console.log(error)
      object = {'name': 'no name'}
  }
  ```

- **语法：**

  ```js
  JSON.parse(value)
  ```

### JSON.stringify

- **作用：**

  `JSON.parse` 的逆运算（JS 数据 => JSON字符串）

- **语法：**

  ```js
  JSON.stringify(value)
  ```

### 使用 `window.JSON` 深拷贝对象

- **案例：**

  ```js
  JSON.parse(JSON.stringify(data))
  ```


## LocalStorage

### 判断 key(值名称)是否存在

```js
let _key = localStorage.hasOwnProperty('key')
```

### 获取

```js
// 从 localStorage 中获取名为 "key" 的值
let JsonData = localStorage.getItem('key')
// 将获取到的值由字符串转换为 JSON 格式
let data = JSON.parse(JsonData)
```

### 存储

```js
let data = { type: 1 }
// 将 data 转换为字符串格式
let stringData = JSON.stringify(data)
// 存储到 localStorage 中并命名为 "key"
localStorage.setItem('key', stringData)
```

### 封装一些长用的方法

```js
// 通过数据名称判断localStorage中是否存在某个数据
function asserLocal(name) {
  return localStorage.hasOwnProperty(name)
}

// 根据存储名称获取 localStorage 的值
function getLocal(name) {
  return JSON.parse(localStorage.getItem(name))
}

// 设置/存储 localStorage 的值
function setLocal(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}
```

## HTTP 状态码

### 1** 信息响应

信息，服务器收到请求，需要请求者继续执行操作

100 Continue 这个临时响应表明，迄今为止的所有内容都是可行的，客户端应该继续请求，如果已经完成，则忽略它。

### 2** 没问题（成功响应）

成功，操作被成功接收并处理

200 ok 请求成功。

201 **请求已经被实现**（该请求已成功），并因此创建了一个新的资源。这通常是在POST请求，或是某些PUT请求之后返回的响应。

204 created

### 3** 进一步操作（重定向）

重定向，需要进一步的操作以完成请求

300 被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。

301 永久重定向（被请求的资源已永久移动到新位置）

302 临时重定向（请求的资源现在临时从不同的 URI 响应请求）

303 See Other

304 Not Modified

### 4** 客户端出错（客户端响应）

客户端错误，请求包含语法错误或无法完成请求

401 当前请求需要用户验证。

403 服务器已经理解请求，但是拒绝执行它。与401响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。

404 请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。

405 请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。

414 请求的URI 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。

422 Unprocessable Entity (WebDAV) 请求格式良好，但由于语义错误而无法遵循。

### 5** 服务端响应

服务器错误，服务器在处理请求的过程中发生了错误

500 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。一般来说，这个问题都会在服务器的程序码出错时出现。

502 作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。