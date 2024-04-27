---
title: React Redux
date: 2021-01-28T11:20:01+08:00
categories: 前端
tags:
  - React
---

## GitHub 案例链接

- [使用 Vanilla JS + Redux 实现简单加减](https://github.com/uphg/react-component-demo/blob/master/src/index-redux.html)
- [使用 React + Redux 实现加减](https://github.com/uphg/react-redux-demo/blob/1465d7e7dfbc006b6fcdbe121a0813f23ff27bcc/src/index.js)
- [使用 React-Redux 实现加减](https://github.com/uphg/react-redux-demo/blob/master/src/index.js)

<!-- 仓库地址：

1. react-component-demo
2. redux-demo
3. react-redux-demo
4. react-router-demo
5. react-hooks-demo
6. react-styled-components-demo -->

## [Vanilla JS](http://vanilla-js.com/)

Vanilla JS 是一个快速，轻量级，跨平台的框架，用于构建功能强大的 JavaScript 应用程序。

谁在使用 Vanilla JS：


Facebook	Google	YouTube	Yahoo	Wikipedia	Windows Live	Twitter	Amazon	LinkedIn	MSN
eBay	Microsoft	Tumblr	Apple	Pinterest	PayPal	Reddit	Netflix	Stack Overflow...

> <p style="opacity: 0.5;">注：Vanilla JS 框架并不存在，它是为了嘲讽那些只学框架，不学原理的前端程序员发明的。</p>

## Redux API

### reducer 函数

用于处理所有事件

```js
function reducer(state = 0, action) {
  switch (action.type) {
    case '点击添加':
      return state + action.payload
    case '点击减少':
      return state - action.payload
    default:
      return state
  }
}
```

### store

存储数据的状态

```js
const store = Redux.createStore(reducer)
```

### store.subscribe(render)

监听数据，每次数据发生变化时执行

```js
store.subscribe(render)
```

### store.dispatch(active: { type, payload })

添加事件，通知 reducer 执行该事件

```js
store.dispatch({ type: '点击添加', payload: 1 })
```

## 使用 Redux

安装

```sh
yarn add redux
```

在项目中引入

```js
import { createStore } from 'redux'

const stateChange = (state = 0, action) => {
  if (action.type === 'add') {
    return state + action.payload
  } else {
    return state
  }
}

const store = createStore(stateChange)

// 常用API
store.subscribe()    // 数据变化时执行，接受一个函数体
store.getState()     // 获取 store 最新的状态
store.dispatch()     // 添加事件，接收参数：action: { type: 'add', payload: 1 }
```

## 使用 React-Redux

官方文档：[https://react-redux.js.org/](https://react-redux.js.org/)

解释 connect 函数

```js
function connect(a) {
  return function fn(b) {
    console.log(a + b)
  }
}
connect(1)(2)
```

### 在项目中添加 React-Redux

React-Redux 相比 Redux 新增了一些 React 相关的组件及 API，是专为 React 开发的 Redux

安装

```sh
yarn add react-redux
#or npm install react-redux
```

index.js 引入 React-Redux

```jsx {5,20,24}
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const stateChange = (state = { number: 0 }, action) => {
  if (action.type === 'add') {
    return { number: state.number + action.payload }
  } else if( action.type === 'back') {
    return { number: state.number - action.payload }
  } else {
    return state
  }
}

const store = createStore(stateChange)

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
```

中间组件 App.js

```jsx
import Box from './Box.js'
import { Component } from 'react'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Box />
      </div>
    )
  }
}

export default App
```

Box.js 组件

```jsx {2,26-30,33-38,40}
import { Component } from 'react';
import { connect } from 'react-redux'

class Box extends Component {
  render() {
    return (
      <div className="Box">
        <p className="message">
          {this.props.message}
        </p>
        <div>
          <button
            className="margin-right-10"
            onClick={() => { this.props.add() }}
          >点击加一</button>
          <button
            onClick={() => { this.props.back() }}
          >点击减一</button>
        </div>
      </div>
    )
  }
}

// mapStateToProps 获取需要的 store 映射到当前组件的 this.props中
function mapStateToProps(state) {
  return {
    message: state.number
  }
}

// mapDispatchToProps 传入多个 dispatch。
function mapDispatchToProps(dispatch) {
  return {
    add: () => dispatch({ type: 'add', payload: 1 }),
    back: () => dispatch({ type: 'back', payload: 1 })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Box);
```

mapDispatchToProps 的其他写法

```js
const mapDispatchToProps = {
  add: () => {
    return { type: 'add', payload: 1 }
  },
  back: () => {
    return { type: 'back', payload: 1 }
  }
}
```

> `connect()()` 的作用：封装 React 组件，添加传入的 store

> 代码地址：[https://github.com/uphg/react-redux-demo](https://github.com/uphg/react-redux-demo)