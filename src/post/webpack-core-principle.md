---
title: Webpack 核心原理
date: 2022-06-13T17:56:09+08:00
tags:
  - Node.js
  - Webpack
---

代码地址：[webpack-core-principle-demo](https://github.com/uphg/webpack-core-principle-demo)

## 打包

- 英文 bundle
- bundle 是打包，bundler 就叫打包器

## 现有代码

index.js

```js
import a from './a.js'
import b from './b.js'
console.log(a.getB())
console.log(b.getA())
```

a.js

```js
import b from './b.js'
const a = {
  value: 'a',
  getB: () => `${b.value} from a`
}

export default a
```

b.js

```js
import a from './a.js'
const b = {
  value: 'b',
  getA: () => `${a.value} from b`
}

export default b
```

- 这三个文件不能直接运行
- 因为**浏览器不支持**直接运行带有 import 和 export 关键字的代码

## 怎样才能运行 import / export

不同浏览器功能不同

- 现在浏览器可以通过 `<script type="module">` 来支持 import export
- IE 8 ~ 15 不支持 import export ，所以不可能运行

兼容策略

- 激进的兼容策略：把代码全放在 `<script type="module">` 里
- 缺点：不被 IE 8 ~ 15 支持；而且会导致**文件请求过多**（每个 import 语句都会请求一个文件）
- **平稳的兼容策略**：把关键字转译为普通代码，并把所有文件打包成一个文件
- 缺点：需要写复杂的代码来完成这件事

解决运行 import / export 的问题：用 `@babel/core` 把它转为一个函数，转码代码见 bundler.ts

## 代码解惑

```js
Object.defineProperty(exports, "__esModule", {value: true});

// 相当于
exports['__esModule'] = true
```

- 添加 `__esModule: true` 属性，方便跟 CommonJS 模块区分开
- 为什么不直接用 `exports.__esModule = true` ？
- 源码中可以通过一个选项切换两种写法，所以两种写法区别不大

```js
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { "default": obj };
}
```

- 为模块添加 default 属性（如果模块没有 default 导出，会直接存为 `exports = { x }`）
- 为什么要加 default 属性？因为 CommonJS 模块没有默认导出，加上方便兼容
- _interop 开头的函数大多都是为了兼容旧代码

关于 _default 

```js
// 编译的代码
var _default = a;
exports['default'] = _default;

// 简化写法
exports['default'] = a
```

> 两种写法都可以，具体原因不要纠结

命名导出

```js
const a = 'a'; export { a }
// 会变成
var a = 'a'; exports.a = a
```

