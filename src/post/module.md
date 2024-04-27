---
title: ES6 模块化
date: 2020-05-25T14:46:09+08:00

tags:
  - JavaScript
---

## 基本示例

`a.js` 文件默认导出一个对象

```javascript
let object = {a: 1, b: 2, c: 3}

export default object
```

`b.js` 中引入 `a.js` 的对象

```javascript
import obj from './a.js'

console.log(obj) // {a: 1, b: 2, c: 3}
```

在 html 文件中添加带有 模块化语法的 js 文件时，必须添加 `type="module"`

```html
<script type="module" src="./main.js"></script>
```

## 导出多个变量

支持多个变量导出

```javascript
let number = 10
let string = 'hello'
let object = {a: 1, b: 2, c: 3}

export { number, string, object }
```

引入多个变量

```javascript
import { number, string, object } from './a.js'

console.log(number)
console.log(string)
console.log(object)
```

还可以使用 `*` 语法批量引入所有变量

```javascript
import * as name from './a.js'

const { number, string, object } = name
console.log(name)
console.log(number)
console.log(string)
console.log(object)
```

## 混用默认导出与导出

支持导出与默认导出语法混用

```javascript
let number = 10
let string = 'hello'
let object = {a: 1, b: 2, c: 3}

export { number, string }
export default object
```

引入时可以将两种语法用逗号分隔

```javascript
import object, { number, string } from './a.js'

console.log(object)
console.log(number)
console.log(string)
```

## 重命名

导出时，可以使用 `as` 语法重命名变量

```javascript
let number = 10
let string = 'hello'

export {
  number as p1,
  string as p2,
  string as p3
}
```

导入重命名后的变量

```javascript
import { p1, p2, p3 } from './a.js'

console.log(p1)
console.log(p2)
console.log(p3)
```

同样，在导出时也可以使用 `as` 重命名

```javascript
import { p1 as num, p2 as string1, p3 as string2 } from './a.js'

console.log(num)
console.log(string1)
console.log(string2)
```

## 执行模块

如果只使用 import 语法引入文件，不指定变量，代码会立即执行

```javascript
let number = 10
let string = 'hello'

console.log(number)
console.log(string)
```

在引入时会执行该文件中的 JavaScript 内容

```javascript
import './a.js'
```

## 导出所有内容

可以使用 `export * from` 的语法在引入的同时全部再次导出，如下：

首先创建一个 `a.js` 文件，包含以下内容

```javascript
let number = 10
let string = 'hello'
let object = {a: 1, b: 2, c: 3}
let array = [1, 2, 3]

export { number, string, object }
export default array
```

再创建一个 `b.js` 文件，将 `a.js` 文件的内容引入并全部导出

```javascript
export * from './a.js'
```

再创建一个 `main.js` 文件，引入 `b.js` 文件中的内容

```javascript
import { number, string, object } from './b.js'

console.log(number)
console.log(string)
console.log(object)
```

> 注意，使用 `export *` 命令会忽略 `a.js` 文件中的 `export default` 导出的内容