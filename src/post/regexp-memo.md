---
title: 正则速查表
date: 2021-12-29T22:49:58+08:00
tags:
  - JavaScript
  - RegExp
---

## loadsh 中的正则

### n进制字符串

```js
// 不规范的16进制字符串值
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i

// 二进制字符串
const reIsBinary = /^0b[01]+$/i

// 八进制字符串值
const reIsOctal = /^0o[0-7]+$/i
```

### 数字

```js
// 无符号的整数值 
const reIsUint = /^(?:0|[1-9]\d*)$/
```

### 字符串处理

```js
// trim
const reTrim = /^\s+|\s+$/g
```

