---
title: React 语法 & 组件化
date: 2021-01-16T18:10:11+08:00
categories: 前端
tags:
  - React
---

## GitHub 案例链接

- [使用 props 单向数据流实现简单的组件通信](https://github.com/uphg/react-component-demo/blob/master/src/main-props.js)
- [使用 eventHub 实现组件间通信](https://github.com/uphg/react-component-demo/blob/master/src/main-eventhub-discrete.js)
- [使用 Redux 代替 EventHub](https://github.com/uphg/react-component-demo/blob/master/src/main-redux.js)

## React 语法

首先使用原生 JS 实现一个简单的数组加减功能

```html
<div>
  <span id="result">0</span>
  <button id="add">+1</button>
  <button id="cut">-1</button>
</div>
```

```js
const result = document.querySelector("#result");
const add = document.querySelector("#add");
const cut = document.querySelector("#cut");

add.addEventListener("click", function() {
  let number = parseInt(result.innerText, 10);
  number += 1;
  result.innerText = number;
});

cut.addEventListener("click", function() {
  let number = parseInt(result.innerText, 10);
  number -= 1;
  result.innerText = number;
});
```

然后使用 React 函数实现，对比一下它们的区别

```html
<div id="root"></div>
```

```js
let number = 0;

const clickAdd = () => {
  number += 1;
  render();
};
const clickCut = () => {
  number -= 1;
  render();
};

render();

function render() {
  const span = React.createElement("span", { className: "text" }, number);
  const addButton = React.createElement("button", { onClick: clickAdd }, "+1");
  const cutButton = React.createElement("button", { onClick: clickCut }, "-1");
  const div = React.createElement(
    "div",
    { className: "parent" },
    span,
    addButton,
    cutButton
  );
  ReactDOM.render(div, document.querySelector("#root"));
}
```

> 案例链接：[https://jsbin.com/zodapipoqu/4/edit?html,js,output](https://jsbin.com/zodapipoqu/4/edit?html,js,output)

React 的写法虽然逻辑上更简洁，但是总要 `React.createElement()` 方法创建 DOM，很麻烦，于是 React 使用了 JSX 优化此部分

```jsx
function render() {
  ReactDOM.render(
    <div class="parent">
      <span class="text">{number}</span>
      <button onClick={clickAdd}>+1</button>
      <button onClick={clickCut}>-1</button>
    </div>,
    document.querySelector("#root")
  );
}
```

> 案例链接：[https://jsbin.com/kevosoluma/edit?html,js,output](https://jsbin.com/kevosoluma/edit?html,js,output)

JSX 语法支持 JS 与标签（XML）混着写

```jsx
function App() {
  const names = ['Alice', 'Emily', 'Kate'];
  return (
    <div>
      {
        names.map(function (name) {
          return <div>Hello, {name}!</div>
        })
      }
    </div>
  )
}
```

<section class="re-part">
  <div>
    <div>Hello, Alice!</div>
    <div>Hello, Emily!</div>
    <div>Hello, Kate!</div>
  </div>
</section>

并且如果插入数组会自动展开

```js
function App() {
  const arr = [
    <h1 style="margin: 0.67em 0;">Hello world!</h1>,
    <h2>React is awesome</h2>,
  ];
  return (
    <div>{arr}</div>
  )
}
```

<section class="re-part">
  <h1>Hello world!</h1>
  <h2 style="border: none; padding: 0;">React is awesome</h2>
</section>

## React 组件

一个简单的 React 组件案例

```jsx
function Box() {
  return (
    <div class="parent">
      <span class="text">{number}</span>
      <button onClick={clickAdd}>+1</button>
      <button onClick={clickCut}>-1</button>
    </div>
  )
}

function App() {
  return (
    <div>
      <Box />
    </div>
  )
}

function render() {
  ReactDOM.render(<App />, document.querySelector("#root"))
}
```

函数组件支持传入属性，属性会以对象的形式传入函数的参数中

```jsx
function Box(props) {
  return (
    <div class="parent">
      <p>名称：{props.name}，年龄：{props.age}</p>
      <span class="text">{number}</span>
      <button onClick={clickAdd}>+1</button>
      <button onClick={clickCut}>-1</button>
    </div>
  )
}

function App() {
  return (
    <div>
      <Box name="张三" age="18" />
    </div>
  )
}
```

> 案例链接：[https://jsbin.com/rupiwoqoku/1/edit?html,js,output](https://jsbin.com/rupiwoqoku/1/edit?html,js,output)

## props.children

如果父组件内只有一个组件 `props.children` 就会返回该组件，可以通过这种方式渲染子组件

```jsx
const HiMessage = (props) => (
  <h1>嗨，{props.name}</h1>
)

const Box = (props) => (
  <div className="box">{props.children}</div>
)

function App() {
  return (
    <Box>
      <HiMessage name="小恒恒" />
    </Box>
  )
}
```

```css
.box {
  border: 1px solid blue;
}
```

<section class="re-part">
  <div class="box">
    <h1 style="margin: 0.67em 0;">嗨，小恒恒</h1>
  </div>
</section>

而如果有多个子节点，它会返回一个子节点组成的数组

```jsx
const Box = (props) => (
  <ol className="box">
  {
    props.children.map( item => <li>{item}</li>)
  }
  </ol>
)

function App() {
  return (
    <Box>
      <span>小恒恒</span>
      <span>小果果</span>
    </Box>
  )
}
```

## 使用 class 组件

为了能够让每个组件有独立的变量，React 还支持以 class 构造函数的方式构建组件

```js
class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }
  clickAdd() {
    this.setState({
      number: this.state.number + 1
    })
  }
  clickCut() {
    this.setState({
      number: this.state.number - 1
    })
  }
  render() {
    return (
      <div>
        <span class="text">{this.state.number}</span>
        <button onClick={this.clickAdd.bind(this)}>+1</button>
        <button onClick={this.clickCut.bind(this)}>-1</button>
      </div>
    )
  }
}

render();

function App() {
  return (
    <div>
      <Box />
    </div>
  )
}

function render() {
  ReactDOM.render(
    <App />,
    document.querySelector("#root")
  );
}
```

> 案例链接：[https://jsbin.com/mijipefegi/1/edit?html,js,output](https://jsbin.com/mijipefegi/1/edit?html,js,output)

### 关于 `setState()`

`setState()` 在每次调用它修改数据时，它都会自动的调用当前组件的 `render()` 更新当前 DOM，并且每次更新会使用 DOM diff 对比每次 DOM 更新的位置，来局部更新 DOM 。

但由于 React 中 `this.setState()` 是异步更新的，它会等所有代码都执行完毕后才调用，所以在一个函数中多次调用 `this.setState()` 它会根据优化合并为一次。

如果想要修改 `this.state` 的数据，最好使用函数回调的方式，函数会接收两个参数，分别是最新的 state 和 最新的 props，如下：

```js
this.setState((state, props) => {
  return {
    number: state.number + 1
  }
})
```

### class 组件的特点

1. 每个组件的 `class` 必须继承 `React.Component` 。
2. 组件会传入一个 props 对象，用于存储外部传入的属性，使用时调用 `this.props.xxx`。
3. 组件中的变量必须在 `this.state` 中事先声明.
4. 如果需要修改变量的值，必须调用 `this.setState()` 修改。
5. `this.setState()` 是异步的，它会等待代码执行完毕后才执行。
6. 组件的 html(xml) 部分必须以 `class` 内的 `render()` 函数的返回值中书写。
7. 如果在 html 中需要绑定事件函数，必须自己使用 `xxx.bind(this)` 来绑定 `this`，否则绑定的函数中无法调用 `this`

## 解决 class 组件 render 函数的 this 问题

有以下三种方式

```jsx
class Box extends React.Component {
  constructor() {
    super()
    this.state = {
      number: 0
    }
  }
  add1 = () => {
    this.setState((state) => ({
      number: state.number + 1
    }))
  }
  add2() {
    this.setState((state) => ({
      number: state.number + 1
    }))
  }
  add3() {
    this.setState((state) => ({
      number: state.number + 1
    }))
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <div>
          <button onClick={this.add1}>（一）点击加一</button>
          <button onClick={this.add2.bind(this)}>（二）点击加一</button>
          <button onClick={() => { this.add3() }}>（三）点击加一</button>
        </div>
      </div>
    )
  }
}
```

## React 组件通信

可以利用 props 将函数传入子组件，实现简单的组件通信，以一个点击按钮发送消息的组件为例

```jsx
// 创建一个子组件，接收父组件传入的值，并在 click 的函数中调用
class Box extends React.Component {
  constructor() {
    super()
  }
  clickButton() {
    this.props.send('hi')
  }
  render() {
    return (
      <div>
        <p>收到的消息：{this.props.message}</p>
        <button onClick={this.clickButton.bind(this)}>发送消息</button>
      </div>
    )
  }
}

// 创建一个父组件，把子组件需要的值传入
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      message: ''
    }
  }
  changeMessage(message) {
    this.setState({
      message: message
    })
  }
  render() {
    return (
      <div>
        <Box message={this.state.message} send={this.changeMessage.bind(this)} />
      </div>
    )
  }
}

// 初始化 React DOM
ReactDOM.render(<App />, document.querySelector("#root"))
```

> 案例链接：[https://jsbin.com/nowaliyiba/2/edit?html,js,output](https://jsbin.com/nowaliyiba/2/edit?html,js,output)

## 使用 eventBus 实现更灵活的组件通信

首先实现一个简单的 eventBus，该 eventBus 只包括事件监听(on)，事件触发(trigger)两个功能

```js
const cache = {}
const eventHub = {
  trigger(eventName, data) {
    const event = cache[eventName]
    if (!event) { return false }
    for (let i = 0; i < event.length; i++) {
      event[i](data)
    }
  },
  on(eventName, fn) {
    if(!cache[eventName]) {
      cache[eventName] = []
    }
    cache[eventName].push(fn)
  }
}
```

实现一个花钱功能的组件，先创建一个子组件，点击按钮会触发 eventBus 的花钱事件

```jsx
class Box extends React.Component {
  constructor() {
    super()
  }
  clickWallet() {
    eventBus.trigger('花钱', 100)
  }
  render() {
    return (
      <div className="box">
        <p>姓名：{this.props.name}，钱包总金额：{this.props.amount}</p>
        <button onClick={this.clickWallet.bind(this)}>花钱</button>
      </div>
    )
  }
}
```

创建一个父组件，将总金额传入子组件，并且在生命周期钩子函数 `componentDidMount` 监听子组件的花钱事件。

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      amount: 10000
    }
  }
  componentDidMount() {
    eventBus.on('花钱', (data) => {
      this.setState((state) => {
        return {
          amount: state.amount - data
        }
      })
    })
  }
  render() {
    return (
      <div>
        <Box name="小花" amount={this.state.amount}/>
        <Box name="小张" amount={this.state.amount}/>
        <Box name="小华" amount={this.state.amount}/>
        <Box name="小郭" amount={this.state.amount}/>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
```

> 生命周期钩子函数 `componentDidMount` 类似 Vue 的 `mounted` ，表示组件已经挂载到实例中。


