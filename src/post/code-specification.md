---
title: 代码规范
date: 2021-12-11T16:51:46+08:00
---

## 文章参考

- [谷歌 JavaScript 风格指南](https://google.github.io/styleguide/jsguide.html)
- [Airbnb JavaScript 风格指南](https://lin-123.github.io/javascript/)
- [JavaScript Standard Style](https://standardjs.com/rules-zhcn.html)
- [如何写出无法维护的代码](https://coolshell.cn/articles/4758.html)
- [The Joel Test: 20 Years Later](https://dev.to/checkgit/the-joel-test-20-years-later-1kjk) StackOverflow 创始人总结的 20 条衡量技术团队好坏的标准
- [视频：The better parts](https://www.youtube.com/watch?v=DxnYQRuLX7Q) Douglas Crockford 阐述他认为 JS 中的好的特性有哪些，坏的特性有哪些

## JavaScript 代码规范

### 文件命名小写

文件名必须全部小写，并且可以包含下划线（`_`）或破折号（`-`），但不能包含额外的标点符号。遵循项目使用的约定。文件名的扩展名必须是 `.js`。

### ES modules

导入路径中的文件必须添加扩展名

```js
// Bad
import '../directory/file';

// Good
import '../directory/file.js';
```

导入命名必须以文件名驼峰式命名

```js
// Naming module imports
import * as fileOne from '../file-one.js';
import * as fileTwo from '../file_two.js';

// Naming default imports
import MyClass from '../my-class.js';
import myFunction from '../my_function.js';
```

### 禁止使用 var

```js
// Bad
var state = true

// Good
let state = false
```

### 使用 const 声明常量

```js
// Bad
let a = 2

// Good
const a = 1
```

### 使用两个空格缩进

```js
// Bad
switch(a){
    case "a":
        break
    case "b":
        break
}

// Good
switch(a){
  case "a":
    break
  case "b":
    break
}
```

### 字符串

默认字符串尽量使用单引号

```js
// Bad
const double = "double"

// Good
const single = 'single'
```

使用模板字面量拼接字符串

```js
// Bad
const string1 = 'Hello, ' + name + '!'

// Good
const string2 = `Hello, ${name}!`
```

### 条件语句

禁止在条件语句中使用常量

```js
// Bad
if (true) {
  // ...
}

// Good
if (a === 2) {
  // ...
}
```

禁止在条件语句中赋值

```js
// Bad
let a = 2
if (a = 1) {
  // ...
  console.log(123)
}

// Good
let a = 2
a = 1
if (a) {
  // ...
  console.log(123)
}
```

### 使用驼峰式命名

```js
// Bar
const { category_id } = query

// Good
const { categoryId } = query
```

### 禁止使用特定语法

禁止使用 `with` 语句，因为 `with` 语句的语法不明确

```js
var obj = {
  p1: 1,
  p2: 2
}
with (obj) {
  p1 = 4
  p2 = 5
}

// 相当于
obj.p1 = 4
obj.p2 = 5
```

禁止使用 `in` 运算符，因为 `in` 运算符是判断对象或其原型链的属性，判断的不明确

```js
const obj = {
  foo: null
}
// 判断 obj 中是否存在 foo 属性
if (foo in obj) {
  // ...
}
```

禁止使用二进制运算符，因为二进制运算符不常用，会使代码难以理解和查错。

```js
0 | 3 // 3
0 & 3 // 0
~ 3 // -4
~~3 // 3
// ...
```

### 不使用分号

```js
// Bad
const a = 1;
const b = { a: 1 };

// Good
const a = 1
const b = { a: 2 }
```

### 禁止对象末尾逗号

```js
// Bad
const o = {
  a: 1,
  b: 2,
}
const a = [
  1,
  2,
]

// Good
const o = {
  a: 1,
  b: 2
}
const a = [
  1,
  2
]
```

