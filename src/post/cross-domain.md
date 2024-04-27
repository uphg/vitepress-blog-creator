---
title: 跨域 & CORS & JSONP
date: 2020-06-10T09:28:17+08:00
tags:
  - 同源策略
  - CORS
  - JSONP
---

## 关键词

- 同源策略

    浏览器故意设计的一个功能限制

- CORS

    突破浏览器限制的一个方法

- JSONP

    IE时代妥协的产物

## 同源策略

### 什么是源

1. 使用 window.origin 或 location.origin 可以得到当前页面的源

2. 源 = 协议 + 域名 + 端口号

<!-- 地址：https://bravchen.github.io/posts/a0000003/#url -->

### 什么是同源

如果两个 url 的**协议**、**域名**、**端口号**完全一致，那么这两个 url 就是同源的

举例

```
https://www.qq.com/ 和 https://www.baidu.com/ 不同源

https://baidu.com/ 和 https://www.baidu.com/ 不同源
```

### 什么是同源策略

如果JS运行在源A里，那么就只能获取源A的数据，不能获取源B的数据，即不允许跨域。

就是不同源的页面之间的JS，不准互相请求数据。



除了同源策略，其实根据请求头(Request Headers)的`referer`，也可以判断请求是否为当前域名。

https://uphg.github.io/images/blog-referer.jpg

## 什么是跨域

当前页面下的JS发起的 AJAX 请求，一般情况下该请求只能是当前页面下同域名的请求，如果请求其他域名下内容就叫做跨域。

### 为什么a.qq.com访问qq.com也算跨域？

因为历史上出现过不同公司共用域名。a.qq.com 和 qq.com 不一定是同一个网站，浏览器为了谨慎起见，认为这是不同源。

### 为什么不同端口也算跨域？

一个端口一个公司。记住安全链条的强度取决于最弱的一环，任何安全相关的问题都要谨慎对待（就是浏览器限制比较严格）

### 为什么两个网站的IP是一样的，也算跨域？

原因同上，IP可以公用（还是浏览器限制比较严格）

### 为什么可以跨域使用CSS、JS和图片等

同源策略限制的是数据访问，我们引用CSS、JS和图片的时候，其实并不知道里面的内容是什么，我们只是在引用。并不能通过AJAX请求拿到里面的数据。

可以看作是我们只是获取到它呈现的样子，并不是它本身的数据。

## 使用CORS解决跨域问题

响应首部中可以携带一个 Access-Control-Allow-Origin 字段，其语法如下:

```
Access-Control-Allow-Origin: http://mozilla.com
```

> 表示允许来自 http://mozilla.com 的请求

MDN文档: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#简单请求

## 使用JSONP兼容IE跨域

**JSONP 和 JSON 并没有任何关系**

我的理解：JSONP 就是利用后台在当前域名下的JS文件中动态写入一个JS数据，将这个数据传入 window.xxx 函数中(`window.xxx(数据)`)，其他域名需要跨域访问时就动态引入一个script标签将当前域名下的JS文件引入，引入后调用 window.xxx 函数，即可访问当前域名下的数据

**封装一个JSONP函数**

```js
function jsonp(url) {
  return new Promise((resolve, reject)=>{
    const random = "chenJSONPCallbackName" + Math.random()
    window[random] = data => {
      resolve(data)
    }
    const script = document.createElement('script')
    // 此处的 callback 是前后端默认约定俗成的名称
    script.src = `${url}?callback=${random}`
    script.onload = ()=>{
      // 如果请求成功,就删除 script 标签
      script.remove()
    }
    script.onerror = ()=>{
      // 如果请求失败就返回 reject() 函数
      reject()
    }
    document.body.appendChild(script)
  })
}

// 使用
jsonp('http://qq.com/main.js').then((data)=>{
  console.log(data)
})
```

## 总结

### 什么是JSONP？

JSONP 就是由于我们需要跨域请求时，当前浏览器不支持 CORS 或不兼容 CORS 等其他原因，我们必须使用另外一种方式来跨域。

于是我们就跨域请求一个 JS 文件，这个 JS 文件会执行一个回调，回调里面就有我们需要的数据，回调的名称是可以随机生成的，可以给一个随机数，然后把这个名字用一个名叫 callback 参数传给后台，后台会把这个函数再次返回给我们并执行。

优点: 兼容IE，它可以跨域。

缺点: 由于它是利用 script 标签获取，所以它只能发送GET请求，它不支持POST请求。

### 什么是跨域？

域名A下的JS想通过AJAX请求域名B的数据，就叫做跨域。

### 什么是CORS？

CORS就是用来解决跨域请求的一种方式，在响应头携带一个 Access-Control-Allow-Origin 字段，表明指定的域名可以访问该网站。

## 拓展

### JSON数据可视化插件

去 Chrome 网上应用店下载 `JSON Viewer` 插件