---
title: 创建 React 项目
date: 2021-02-06T20:01:02+08:00
categories: 前端
tags:
  - React
---

## CDN 引入

首先在 [BootCDN](https://www.bootcdn.cn/) 搜索 react ，选择 `.../umd/react.production.min.js` 后缀的版本。

再搜索 react-dom ，选择 `.../umd/react-dom.production.min.js` 后缀的版本。

把他们都引入项目中，示例

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>JS Bin</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/react/17.0.1/umd/react.production.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.1/umd/react-dom.production.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```jsx
function App() {
  return <div>App</div>
}

// 挂载
ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
```

> CDN 引入案例：[https://github.com/uphg/react-component-demo](https://github.com/uphg/react-component-demo)

## 创建本地应用

```sh
# 全局安装
yarn global add create-react-app
# 创建一个项目
create-react-app my-app
cd my-app
# 运行测试
yarn start
```

## React CSS 解决方案

这里收集了常用的几种方案：[https://github.com/MicheleBertoli/css-in-js](https://github.com/MicheleBertoli/css-in-js)

## 使用 styled-components

添加样式

```jsx
import styled from 'styled-components'

const Button = styled.button`
  color: red;
`

function App() {
  return <Button>我是按钮</Button>
}
```

添加动画

```jsx
import styled, { keyframes } from 'styled-components'

const ImgSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Img = styled.img`
  animation: ${ImgSpin} infinite 20s linear;
`

function App() {
  return <Img src={...} />
}
```

> GitHub 链接：[https://github.com/uphg/react-styled-components-demo](https://github.com/uphg/react-styled-components-demo)

## 使用 CSS Modules

参考教程：[http://www.ruanyifeng.com/blog/2016/06/css_modules.html](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)