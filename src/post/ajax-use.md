---
title: AJAX
date: 2020-06-09T15:44:57+08:00
tags:
  - JavaScript
  - AJAX
---

## 什么是 AJAX

- 全称：Async JavaScript And XML（异步的 JavaScript 和 XML）。
- 功能：用 JavaScript 发请求和收响应。
- 概念：AJAX 是浏览器的功能，浏览器可以发请求收响应，浏览器在 `window` 上加了一个 `XMLHttpRequest` 函数，用这个函数可以构造一个对象，用于发送请求接收响应。

## 一个完整的 AJAX 请求

```js
buttons.onclick = () => {
  const request = new XMLHttpRequest();
  request.open("GET", `/xxx`); // 设置请求格式，地址
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      // 判断请求处于哪个状态
      /* 请求在 200 - 300 之间就是请求成功了 */
      if (request.status >= 200 && request.status < 300) {
        console.log("请求成功,数据为");
        let object = JSON.parse(request.response);
        console.log(object);
      } else {
        console.log("请求失败");
      }
    }
  };
  request.send(); // 发送请求
};
```

其中：

`new XMLHttpRequest();` 构造函数，用于初始化一个 `XMLHttpRequest` 实例对象。

`request.open("GET", "/xxx")` 设置请求格式，地址。

`request.send()` 发送请求。

`request.onreadystatechange` 表示监听当前的 `readyState` 状态，只要 `readyState` 属性发生变化，就会调用相应的[处理函数](https://developer.mozilla.org/zh-CN/docs/Web/API/EventHandler)。

`request.readyState` 表示 [`document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 的加载状态。也就是页面的加载状态。它的值的状态可以用下表展示：

| 代码                                   | readyState 的值 |
| -------------------------------------- | --------------- |
| `const request = new XMLHttpRequest()` | 0               |
| `request.open()`                       | 1               |
| `request.send()` 发送请求              | 2               |
| 开始下载页面信息，页面的信息逐步显示   | 3               |
| 页面信息下载完成，服务器开始响应       | 4               |

只有当页面信息加载完成后(`readyState = 4`)，服务器才会开始响应，这时才会开始返回请求的数据。

`request.status` 表示请求成功后，返回的状态码，常用的有 2xx，3xx，4xx 等，如果返回的状态码是 200 - 300 之间（不包括 300），则表示请求成功。

## 封装一个 jQuery.ajax

```js
window.jQuery.ajax = function(url, method, body, successFn, failFn) {
  let request = new XMLHttpRequest();
  request.open(method, url);
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 300) {
        successFn.call(undefined, request.responseText);
      } else if (request.status >= 400) {
        failFn.call(undefined, request);
      }
    }
  };
  request.send(body);
};
```

## 使 jQuery.ajax 满足 Promise 规则

```js
window.jQuery.ajax = function({ url, method, body, headers }) {
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    for (let key in headers) {
      let value = headers[key];
      request.setRequestHeader(key, value);
    }

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          resolve.call(undefined, request.responseText);
        } else if (request.status >= 400) {
          reject.call(undefined, request);
        }
      }
    };
    request.send(body);
  });
};
```



> 123123
