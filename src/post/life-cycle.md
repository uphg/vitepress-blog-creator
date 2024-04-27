---
title: React 生命周期
date: 2021-02-01T17:10:01+08:00
categories: 前端
tags:
  - React
---

## Vanilla JS 生命周期案例

```js
const app = document.querySelector('#app')

// create
let div = document.createElement('div')
div.style.border = '1px solid #cccccc'
div.style.padding = '20px'

let state = 0

div.innerHTML = `
  <p>${state}</p>
  <button>+1</button>
  <button>die</button>
`
// mount
app.appendChild(div)

div.querySelector('button').onclick = () => {
  state += 1
  // update
  div.querySelector('p').innerText = state
}

// destroy
div.querySelectorAll('button')[1].onclick = () => {
  div.querySelector('button').onclick = null
  div.querySelectorAll('button')[1].onclick = null
  div.remove()
  div = null
}
```

> 案例链接：[https://jsbin.com/pihavuhuqe/5/edit?html,js,output](https://jsbin.com/pihavuhuqe/5/edit?html,js,output)


## React 生命周期图

<p style="text-align: center;">———— 简易版 ————</p>

![图片](/images/react-life-cycle-use.jpg)

<p style="text-align: center;">———— 完整版 ————</p>

![图片](/images/react-life-cycle-complete.jpg)

> 图片来自：[https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)


## 常用的生命周期

案例

```jsx
import React, { Component } from "react";
import "./styles.css";

class App extends Component {
  // 创建组件
  constructor() {
    super();
    this.state = {
      number: 0
    };
    console.log("创建 App");
  }
  // 挂载组件之前（不推荐，unsafe）
  componentWillMount() {
    console.log("挂载 App 之前");
  }
  render() {
    console.log("挂载/更新 App");
    return <div className="App"></div>;
  }
  // 挂载组件之后
  componentDidMount() {
    console.log("挂载 App 完毕");
  }
  // 更新组件之前（不推荐，unsafe）
  componentWillUpdate() {
    console.log("更新 App 之前");
  }
  // 更新组件之后
  componentDidUpdate() {
    console.log("更新 App 之后");
  }
  // 销毁之前
  componentWillUnmount() {
    console.log("App 销毁之前");
  }
  // 父组件的 Props 值更新后（不推荐，unsafe）
  componentWillReceiveProps() {

  }
}
```

## 关于 `this.setState()`

1. 不要在组件挂载前（mount）使用 `this.setState()`
2. 不要在组件更新的钩子中（update、render）使用 `this.setState()`
3. 不要再 constructor 中使用 `this.setState()`

## 关于 Ajax 请求

最好在 componentDidMount 或事件执行函数中发起请求（官方推荐）

> 参考 React 官方文档：[https://zh-hans.reactjs.org/docs/faq-ajax.html](https://zh-hans.reactjs.org/docs/faq-ajax.html)

## 关于 `shouldComponentUpdate()`

手动的判断当前值变化后是否需要重新 `render()`。`return true` 表示更新，`return false` 表示不更新。

返回值默认为 `true`

它接收两个参数：[nextProps, nextState]，表示最新的 props 和 state

使用示例

```js
shouldComponentUpdate(nextProps, nextState) {
  // 如果 this.state.n 没有变化，则不更新 render
  if (this.state.n === nextState.n) {
    return false;
  } else {
    return true;
  }
}
```

