---
title: Vue Router 的原理
date: 2021-01-12T15:05:00+08:00

tags:
  - Vue
---

## hash 路由

hash 路由可以在任何情况下使用，但是 hash 路由 `#` 后的内容无法被服务器接收到，所以你不论访问那个页面，服务器都只会认为你访问了根路径（SEO不友好）。

### 实现 hash 路由

实现一个简单的跳转功能，路由显示 #1 时跳转 div1 ，路由显示 #2 时跳转 div2... 依次类推。

```html
<div class="navbar">
  <a href="#1">go to 1</a>
  <a href="#2">go to 2</a>
  <a href="#3">go to 3</a>
  <a href="#4">go to 4</a>
</div>
<div id="app"></div>
```

```js
const app = document.querySelector('#app')

// 创建路由 hash 表
const hash = {
  '1': createDiv('1'),
  '2': createDiv('2'),
  '3': createDiv('3'),
  '4': createDiv('4')
}

// 生成 404 页面
const page404 = createDiv('404')

// 第一次加载页面时根据路由渲染页面
router(app)

// 监听路由，路由改变时再次渲染页面
window.addEventListener('hashchange', () => {
  router(app)
})

// 根据路由将元素插入到 DOM 中
function router(el) {
  let number = window.location.hash.substr(1)
  // 如果 number 不存在，默认显示 div1
  number = number || 1
  el.innerHTML = ''
  const div = hash[number]
  // 如果 div 不存在，则渲染 404 页面
  if (div) {
    el.appendChild(div)
  } else {
    el.appendChild(page404)
  }
}

// 创建 div ，并添加内容
function createDiv(text) {
  const div = document.createElement('div')
  div.innerHTML = text
  return div
}
```

案例地址：[https://codesandbox.io/s/determined-hooks-wgj7u](https://codesandbox.io/s/determined-hooks-wgj7u)

## history 路由

使用 history 路由，必须要保证后端能够将所有前端路由都渲染至同一个页面，也就是不论请求该域名下的那个页面，都渲染同一个页面，前端根据请求的路径渲染不同的内容。

### 实现 history 路由

history 模式的路由，主要注意

1. 需要监听 a 标签的点击事件，阻止它的默认点击事件，防止页面刷新。
2. 利用 `window.history.pushState()` API 将路径添加到 url 中。
3. 每次点击 a 标签后重新渲染页面。

```html
<div class="navbar">
  <a class="link" href="/1">go to 1</a>
  <a class="link" href="/2">go to 2</a>
  <a class="link" href="/3">go to 3</a>
  <a class="link" href="/4">go to 4</a>
</div>
<div id="app"></div>
```

```js
const app = document.querySelector("#app");

// 创建路由 hash 表
const hash = {
  "1": createDiv("1"),
  "2": createDiv("2"),
  "3": createDiv("3"),
  "4": createDiv("4")
};

// 生成 404 页面
const page404 = createDiv("404");

// 第一次加载页面时根据路由渲染页面
router(app);

// 初始化 a 标签事件监听
initLinkChange();

// 监听路由，路由改变时再次渲染页面
function onStateChange() {
  router(app);
}

// 根据路由将元素插入到 DOM 中
function router(el) {
  let number = window.location.pathname.substr(1);
  // 如果 number 不存在，默认显示 div1
  number = number || 1;
  el.innerHTML = "";
  const div = hash[number];
  // 如果 div 不存在，则渲染 404 页面
  if (div) {
    el.appendChild(div);
  } else {
    el.appendChild(page404);
  }
}

// 创建 div ，并添加内容
function createDiv(text) {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div;
}

// 遍历所有 a 标签，阻止它的默认事件，禁止刷新页面
function initLinkChange() {
  const allA = document.querySelectorAll("a.link");
  for (let a of allA) {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      window.history.pushState(null, `page${href}`, href);
      onStateChange();
    });
  }
}
```
