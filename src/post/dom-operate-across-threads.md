---
title: DOM 操作跨线程
date: 2020-09-14T23:07:31+08:00
tags:
  - JavaScript
  - DOM
---

## 概述

JavaScript 引擎是无法直接操作页面的，只能通过 JavaScript 调用 DOM API，当浏览器发现 JavaScript 调用了像 `document.body.appendChild(div)` 这样的 DOM API ，就会通知渲染引擎，新增一个与 JavaScript 中 div 属性一模一样的 div。这就叫做**跨线程通信**。

## 插入一个标签的完整过程

1. 元素放入页面之前：
    - 你对元素所有操作都在 JavaScript 线程中。
2. 元素放入页面时：
    - 浏览器发现 JavaScript 的意图，通知渲染引擎在页面中渲染对应的元素。
3. 元素放入页面之后：
    - 你对元素的任何操作都有可能触发重新渲染。

## 可能会触发重新渲染的操作

由于页面的重新渲染会很耗费内存，所以浏览器会想尽办法减少重新渲染的次数，在某些不必要的情况下并不会进行重新渲染。或者通过合并多次 JavaScript 对 DOM API 的操作，以此减少重新渲染的次数。

**通过修改 `id` 属性触发重新渲染**

比如一个获取到一个 div，修改它的 `div.id = 'newId'`。此时如果 newId 附带样式等操作，就会触发重新渲染，如果只是id，可能不会触发。

**通过修改 `title` 属性触发重新渲染**

假如有如下样式的 div

```html
<div id="div" title="titleHi"></div>
```

```css
div::after {
  content: attr(title);
}
```

运行以下代码

```js
div.title = 'newId'
```

> 当它的 `title` 被修改时，由于 after 伪元素需要通过它的 `title` 属性来渲染，所以会触发浏览器的重新渲染。

**3. 通过获取宽度/高度触发重新渲染**

假如有如下样式的 div

```html
<div id="test"></div>
```

```css
.start {
  border: 1px solid red;
  width: 100px;
  height: 100px;
  transition: width 1s;
}

.end {
  width: 200px;
}
```

运行如下代码

```js
test.classList.add('start')
test.clientWidth             // 这句话看似无用，实际会触发重新渲染
test.classList.add('end')
```

案例链接：[http://js.jirengu.com/yefac/1/edit?html,css,js,output](http://js.jirengu.com/yefac/1/edit?html,css,js,output)

> 当你连续对同一个 div 做多次操作时，浏览器可能会合并为一次操作，在某些情况下，会导致动画的效果无法展现。这时可以获取一下元素的宽度，让浏览器不得不触发重新渲染（因为在获取宽度时必须要知道当前元素真正的宽度，也就是把它放进浏览器窗口中）。

## 属性同步

1. 一个元素默认的标准属性被修改时，会自动同步至浏览器，比如 `id`、`className`、`title` 等。
2. 带有 `data-` 的属性原理同上。
3. 如果给元素随便赋值一个非标准属性，如 `x="1"` 则对该元素的属性修改只会停留在 JavaScript 中，并不会同步到页面。

> 结论：如果需要自定义一个属性，并希望它在修改时可以被浏览器同步到页面，就使用 `data-` 作为前缀。
