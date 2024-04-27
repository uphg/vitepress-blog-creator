---
title: 字面量增强
date: 2020-05-12 12:12:32
---

## 字面量的含义

它写出来就代表它所展示的意思，例如：`1, 2, 3, true, false, {}`，很直观的量。

相反的，像构造函数，或者复杂的对象，就不是字面量。

## 新版进制区分

如之前的写法

二进制

```js
1010101;
// 85
```

八进制

```js
0777;
// 511
```

ES6 的写法

二进制

```js
0b1010101;
// 85
```

八进制

```js
0o777;
// 511
```

## 字符串支持 Unicode

获取字符编码

以获取 16 进制的 `"你"` 的字符串编码为例：

```js
"你".charCodeAt().toString(16); // "4f60"
```

`"你"` 使用的字节：

<table>
  <tbody>
    <tr>
      <td>0</td> <td>1</td> <td>0</td> <td>0</td>
      <td>1</td> <td>1</td> <td>1</td> <td>1</td>
      <td>0</td> <td>1</td> <td>1</td> <td>0</td>
      <td>0</td> <td>0</td> <td>0</td> <td>0</td>
    </tr>
    <tr style="text-align: center;">
      <td colspan=4>4</td>
      <td colspan=4>F</td>
      <td colspan=4>6</td>
      <td colspan=4>0</td>
    </tr>
  </tbody>
</table>

这里的 `"你"` 只需要 1 个字符表示，如下

```js
"你".length; // 1
```

而 `"𝌆"` 的则需要两个字符表示

```js
"𝌆".length; // 2
```

也就是，`"𝌆" === "\uD834\uDF06"` 如下：

```js
"𝌆".charCodeAt(0).toString(16); // "d834"
"𝌆".charCodeAt(1).toString(16); // "df06"
```

`"𝌆"` 使用的字节：

`"d834"`

<table>
  <tbody>
    <tr>
      <td>1</td> <td>1</td> <td>0</td> <td>1</td>
      <td>1</td> <td>0</td> <td>0</td> <td>0</td>
      <td>0</td> <td>0</td> <td>1</td> <td>1</td>
      <td>0</td> <td>1</td> <td>0</td> <td>0</td>
    </tr>
    <tr style="text-align: center;">
      <td colspan=4>d</td>
      <td colspan=4>8</td>
      <td colspan=4>3</td>
      <td colspan=4>4</td>
    </tr>
  </tbody>
</table>

`"df06"`

<table>
  <tbody>
    <tr>
      <td>1</td> <td>1</td> <td>0</td> <td>1</td>
      <td>1</td> <td>1</td> <td>1</td> <td>1</td>
      <td>0</td> <td>0</td> <td>0</td> <td>0</td>
      <td>0</td> <td>1</td> <td>1</td> <td>0</td>
    </tr>
    <tr style="text-align: center;">
      <td colspan=4>d</td>
      <td colspan=4>f</td>
      <td colspan=4>0</td>
      <td colspan=4>6</td>
    </tr>
  </tbody>
</table>

可以看到，之前只能用两个字符表示这类字节。而在 ES6 新添加了对 Unicode 编码的全面支持，可以通过一个字符编码来表示该字节了

例如，表示日文的你

```js
String.fromCodePoint(0x2f804); // "你"
"你".length; // 2
"你".codePointAt(0); // 194564
"你".codePointAt(0).toString(16); // "2f804"
```

MDN 文档：[`String.fromCodePoint()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint)
