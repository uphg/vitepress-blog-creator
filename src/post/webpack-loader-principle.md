---
title: Loader 原理
date: 2022-06-14T21:27:44+08:00
---

代码地址：[github.com/uphg/webpack-loader-principle-demo](https://github.com/uphg/webpack-loader-principle-demo)

## 实现一个可加载 CSS 的 Loader

如何把 CSS 变为 JS

style.css

```css
body {
  color: red;
}
```

css-loader.js

```js
// 
const transform = code => `
const str = ${JSON.stringify(code)}
if (document) {
  const style = document.createElement('style')
  style.innerHTML = str
  document.head.appendChild(style)
}
export default str
`

module.exports = transform
```

运行 `bundler-css-loader.ts` 转译上面的 CSS

## 单一职责原则

- **webpack 里每个 loader 只做一件事**
- 上面的代码一个 loader 做了两件
- 一是把 CSS 变为 JS 字符串
- 二是把 JS 字符串放到 style 标签中
- 所以加载 CSS 要分为两个 loader：css-loader、style-loader

## Webpack 官方 style-loader

- style-loader 在 pitch 钩子中通过 css-loader 来 require 文件内容
- 然后在内容后使用 injectStylesIntoStyleTag（插入样式到 style 标签）方法处理内容

## 学习源码的正确思路

- 不推荐直接看源码
- 应该先大胆的假设源码的实现方式
- 当实现遇到问题的时候
- 再带着问题去看源码

- 一定要自己先想一次
- 当你的思路无法满足需求的时候
- 再去看别人的实现
- 看懂了，你就成长了

## 常用 CSS Loader 转换方式

加载 .scss 文件

- 写个 sass-loader 把 SCSS 文件转为 css
- 再交给 css-loader 转为 JS
- 最后用 style-loader 创建 style 标签

加载 .less、.styl 文件同理

## Webpack 有多少 loader

- 这里是官方整理的[推荐列表](https://webpack.js.org/loaders/)
- 这里是社区整理的[推荐列表](https://webpack.js.org/awesome-webpack/)

## Raw Loader 源码

[代码地址](https://github.com/webpack-contrib/raw-loader)，功能：将文件转为字符串

```js
// index.js
import { getOptions } from 'loader-utils';
import { validate } from 'schema-utils';

import schema from './options.json';

export default function rawLoader(source) {
  const options = getOptions(this); // 处理选项

  // 验证选项
  validate(schema, options, {
    name: 'Raw Loader',
    baseDataPath: 'options',
  });

  // 将源码转为字符串，对 JSON.stringify 做特殊处理，参考：https://github.com/nodejs/node-v0.x-archive/issues/8221
  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  return `${esModule ? 'export default' : 'module.exports ='} ${json};`;
}
```

## CSS Loader

[代码地址](https://github.com/webpack-contrib/css-loader)主要思路：使用 getImportCode 获取 CSS 代码，并在 return 的时候返回

```js
// CSS Loader index.js
export default async function loader(content, map, meta) {
  const rawOptions = this.getOptions(schema);
  ...
  const importCode = getImportCode(imports, options);
  ...
  // 由于它需要支持异步，所以只能通过 callback 返回
  callback(null, `${importCode}${moduleCode}${exportCode}`);
}
```

## Style Loader

[代码地址](https://github.com/webpack-contrib/style-loader)，关键部分源码

```js
const loaderAPI = () => {};

loaderAPI.pitch = function loader(request) {
  const options = this.getOptions(schema);
  ...
  switch (injectType) {
    ...
    case "styleTag":
    case "autoStyleTag":
    case "singletonStyleTag":
    default: {
      return `
      ${getImportStyleAPICode(esModule, this)}
      ${...}
content = content.__esModule ? content.default : content
...
options.insertStyleElement = insertStyleElement;
var update = API(content, options);
`;
    }
  }
}

export default loaderAPI;
```

思路

- 获取要渲染的 style 类型，通常为 style 标签，也就是 `"styleTag"`
- 获取代码 getImportStyleAPICode
- 获取 content（CSS 文件内容）
- 使用 API 方法处理 content

## 思考题

- `import logo from './images/logo.png'`
- React：`<img src={logo}>`
- 这个要用什么 loader，其工作原理是什么？

思路1

- 获取原图片路径，拷贝至 public 目录下对应位置，将 public 目录下对应路径返回给 import 的 logo

思路2

- 如果图片不是特别大，直接获取图片源码，转为 data base64 赋值给 logo

## 如何实现一个自己的 Webpack loader

步骤

1. 按照[文档](https://webpack.js.org/contribute/writing-a-loader/)初始化一个项目
2. 看别人怎么写的
3. 复制过来
4. 改一改，有问题就翻[自定义插件](https://webpack.js.org/contribute/writing-a-loader/)文档
5. 测试（文档里有示例，也可以抄别人的思路）
6. 发布到 npm
7. 在项目里使用它 markdown-loader

## Webpack 的 Loader 是什么？

- Webpack 自带的打包器只能支持 JS 文件
- 当我想加载 css/less/scss/stylus/ts/md 文件时，就需要用 loader
- loader 的原理就是把文件内容包装成可以运行的 JS

以加载 CSS 文件为例

- 加载 CSS 需要用到 style-loader 和 css-Loader
- css-loader 把代码从 CSS 代码变为 `export default str` 形式的 JS 代码
- style-loader 把代码挂载到 head 里的 style 标签里
- 如果了解 style-loader 源码，可以深入讲一下 pitch 钩子和 request 对象

把自己写的简易 loader 放在 GitHub

- 方便面试时向面试官展示
- 把代码思路讲一遍
- 说一说自己的 loader 和 Webpack 的 Loader 区别在哪里