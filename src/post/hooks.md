---
title: React Hooks
date: 2021-02-01T17:10:01+08:00
categories: 前端
tags:
  - React
---

## GitHub 案例链接

- [使用 useState 案例](https://github.com/uphg/react-hooks-demo/blob/master/src/view/demo-1/Button.js)
- [使用 useContext 案例](https://github.com/uphg/react-hooks-demo/tree/master/src/view/demo-2)
- [使用 useReducer 案例](https://github.com/uphg/react-hooks-demo/blob/master/src/view/demo-3/CounterDemo.js)
- [使用 useEffect 案例](https://github.com/uphg/react-hooks-demo/blob/master/src/view/demo-4/EffectDemo.js)
- [模块化 Hooks useEffect 案例](https://github.com/uphg/react-hooks-demo/tree/master/src/view/demo-5)

## React Hooks

使用案例

```jsx
import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点我 +1</button>
      <button onClick={() => setCount(count - 1)}>点我 -1</button>
    </div>
  );
}
```

> 案例地址：[https://codesandbox.io/s/upbeat-stallman-24j8j?file=/src/App.js](https://codesandbox.io/s/upbeat-stallman-24j8j?file=/src/App.js)

修改对象

```jsx
import React, { useState } from "react";

function App() {
  const [user, setUser] = useState({ name: "HengHeng", age: 18 });
  const add = () => {
    setUser({
      ...user, // 先把之前的 user 复制
      age: user.age + 1 // 覆盖 age 属性
    });
  };
  const back = () => {
    setUser({
      ...user, // 先把之前的 user 复制
      age: user.age - 1 // 覆盖 age 属性
    });
  };
  return (
    <div className="App">
      <p>
        用户名：{user.name}，年龄：{user.age} 岁
      </p>
      <button onClick={add}>点我 +1</button>
      <button onClick={back}>点我 -1</button>
    </div>
  );
}
```

> 案例链接：[https://codesandbox.io/s/fancy-rain-svh2w?file=/src/App.js](https://codesandbox.io/s/fancy-rain-svh2w?file=/src/App.js)

修改数组

```jsx
import React, { useState } from "react";

function App() {
  const [list, setList] = useState([0, 1, 2]);
  const addList = () => {
    const array = [...list];
    array.push(array.length);
    setList(array);
  };
  const removeList = () => {
    const array = [...list];
    array.pop();
    setList(array);
  };
  return (
    <div className="App">
      <p>{list.join("，")}</p>
      <button onClick={addList}>点击添加项</button>
      <button onClick={removeList}>点击删除项</button>
    </div>
  );
}
```

> 案例链接：[https://codesandbox.io/s/jolly-goldberg-r704u?file=/src/App.js](https://codesandbox.io/s/jolly-goldberg-r704u?file=/src/App.js)

## 副作用函数

副作用函数表示改函数引用了外部的内容，如下

```js
// 无作用函数
function f1() { }

// 副作用函数
function f2() {
  console.log(1)
}

// 纯函数，没有副作用的函数
function f3(a, b) {
  return a + b
}
```

当我们改写了 console.log 方法后，f2 就没办法打出 1

```js
f2() // 1

console.log = () => { }
f2() // undefineds
```

由于引用外部内容会导致意想不到的后果，所以叫副作用函数

## 使用 Effect Hook

Effect Hook 可以让你在函数组件中执行**副作用操作**，作用类似生命周期的 mount，只运行一次

在 `public/index.html` 中添加一个 output

```html
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div>output：<span id="output"></span></div>
  <div id="root"></div>
</body>
```

此时就可以在 App 中使用 useEffect 操作该元素

```jsx
import React, { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const output = document.querySelector("#output");
    output.innerText = count;
  });
  return (
    <div className="App">
      <p>{count}</p>
      <div>
        <button onClick={() => setCount(count + 1)}>点击 +1</button>
      </div>
    </div>
  );
}
```

## 相关教程

- [React Hooks 入门教程](https://uphg.gitee.io/store/react/react-hooks.html)
- [轻松学会 React 钩子：以 useEffect() 为例](https://uphg.gitee.io/store/react/react-hooks-useeffect.html)