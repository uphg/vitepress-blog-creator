---
title: React Context
date: 2021-02-01T17:02:03+08:00
categories: 前端
tags:
  - React
---

## 使用 React Context 传值

使用案例

```jsx
const NumberContext = React.createContext(100);

function F1() {
  return (
    <div className="bordered">
      <p>F1</p>
      <F2 />
    </div>
  );
}

function F2() {
  return (
    <div className="bordered">
      <p>F2</p>
      <NumberContext.Consumer>
        {(number) => <F3 message={number} />}
      </NumberContext.Consumer>
    </div>
  );
}

function F3(props) {
  return (
    <div className="bordered">
      <p>F3，message：{props.message}</p>
    </div>
  );
}

export default function App() {
  return (
    <NumberContext.Provider value="99">
      <div className="App">
        <F1 />
      </div>
    </NumberContext.Provider>
  );
}
```

> 案例链接：[https://codesandbox.io/s/optimistic-ramanujan-o53gs?file=/src/App.js](https://codesandbox.io/s/optimistic-ramanujan-o53gs?file=/src/App.js)

## 实现一个 Context 组件

React 的父组件可以通过 `props.children` 函数得到它当前包裹的子组件的信息，所以可以通过这个接收到所有子组件的信息，并做处理。

```jsx
function Consumer(props) {
  let number = 100;
  props.children(number);
  return <div>Consumer</div>;
}

function App() {
  return (
    <Consumer>
      {(n) => console.log("n 的值为：" + n)}
    </Consumer>
  );
}
// n 的值为：100 
```

> 案例链接：[https://codesandbox.io/s/objective-engelbart-lg31s?file=/src/App.js](https://codesandbox.io/s/objective-engelbart-lg31s?file=/src/App.js)

如果组件包裹了多个内容，props.children 会返回一个数组

```jsx
function Consumer(props) {
  let number = 100;
  console.log(props.children);
  props.children[1](number);
  return <div>Consumer</div>;
}

function App() {
  return (
    <Consumer>
      <p></p>
      {(n) => console.log("n 的值为：" + n)}
    </Consumer>
  );
}
// (2) [Object, ƒ ()]
// n 的值为：100 
```

> 案例链接：[https://codesandbox.io/s/objective-engelbart-lg31s?file=/src/App.js](https://codesandbox.io/s/objective-engelbart-lg31s?file=/src/App.js)

执行 `props.children()` 会返回子组件 Consumer return 的内容，可以通过这个方式渲染子组件

```jsx
function Consumer(props) {
  let number = 100;
  let result = props.children(number);
  return <div>{result}</div>;
}

function Box(props) {
  return <p>message：{props.message}</p>;
}

function App() {
  return <Consumer>{(n) => <Box message={n} />}</Consumer>;
}
```

> 案例链接：[https://codesandbox.io/s/objective-engelbart-lg31s?file=/src/App.js](https://codesandbox.io/s/objective-engelbart-lg31s?file=/src/App.js)

## 修改 Context 的值

由于改值时只允许在 App 中修改（因为值是从 App 传入，假设各组件都是一个单文件），所以 App 的子孙组件想要修改 App 的值，同样也要通过 Context 传入一个 set 方法

```jsx
const NumberContext = React.createContext(100);

function F1() {
  return (
    <div className="bordered">
      <p>F1</p>
      <F2 />
    </div>
  );
}

function F2() {
  return (
    <div className="bordered">
      <p>F2</p>
      <NumberContext.Consumer>
        {(e) => <F3 message={e.number} setValue={e.setNumber} />}
      </NumberContext.Consumer>
    </div>
  );
}

function F3(props) {
  return (
    <div className="bordered">
      <p>F3</p>
      <p>{props.message}</p>
      <button onClick={props.setValue}>点击+1</button>
    </div>
  );
}

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      number: 99
    };
  }
  setNumber() {
    this.setState((state) => {
      return {
        number: (state.number += 1)
      };
    });
  }
  render() {
    const value = {
      number: this.state.number,
      setNumber: this.setNumber.bind(this)
    };
    return (
      <div className="App">
        <p>{"APP"}</p>
        <NumberContext.Provider value={value}>
          <F1 />
        </NumberContext.Provider>
      </div>
    );
  }
}
```

> 案例链接：[https://codesandbox.io/s/confident-cloud-qs2ox?file=/src/App.js](https://codesandbox.io/s/confident-cloud-qs2ox?file=/src/App.js)

