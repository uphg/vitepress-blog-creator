---
title: ?? 运算符
date: 2021-10-22T11:01:16+08:00
---

## 基础语法

`??` 与 `||` 运算符非常相似，不同的地方在于，`??` 语法评估运算符时不使用 "truthy" （真实的）而是 "nullish"（无效的）判断，意思是“值严格等于 `null` 或 `undefined`”才会执行后面的内容。

**使用 `??`**

```js
// 
false ?? true;   // => false
0 ?? 1;          // => 0
'' ?? 'default'; // => ''

null ?? [];      // => []
undefined ?? []; // => []
```

**使用 `||`**

```js
false || true;   // => true
0 || 1;          // => 1
'' || 'default'; // => 'default'

null || [];      // => []
undefined || []; // => []
```

> 上面的例子表明：`||` 只要前面的值转为布尔类型是 `false` 就会执行后面的内容，但 `??` 只有前面的值完全等于 `null` 或 `undefined` 才会执行后面的内容。

## 与其他运算符混用

默认情况下，如果 `&&` 和 `||` 混用，默认 `&&` 的优先级更高，如下：

```js
1hs && middle || rhs  // => (1hs && middle) || rhs
1hs || middle && rhs  // => 1hs || (middle && rhs)
```

如果它们和 `??` 混用，则必须把其中一种运算符添加在括号中使用

```js
(lhs && middle) ?? rhs;
lhs && (middle ?? rhs);

(lhs ?? middle) && rhs;
lhs ?? (middle && rhs);

(lhs || middle) ?? rhs;
lhs || (middle ?? rhs);

(lhs ?? middle) || rhs;
lhs ?? (middle || rhs);
```

## 判断 `document.all`

使用 `??` 判断 `document.all` 会根据它真实的值去判断

```js
document.all || true; // => true
document.all ?? true; // => HTMLAllCollection[]
```

