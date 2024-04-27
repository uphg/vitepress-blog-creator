---
title: 动态 REM
date: 2020-05-20T16:06:52+08:00
tags:
  - CSS
---

## rem 是什么

rem 就是页面根元素（html元素）的 `font-size` 大小

```css
html {
  font-size: 100px;
}

div {
  width: 1rem; /* 此处 1rem = 100px */
}
```

## 动态 rem

我们可以通过在页面中加载一段简单的 JS 来实现 rem 根据屏幕宽度动态改变

```js
const pageWidth = window.innerWidth
document.write('<style>html{font-size:' + pageWidth/10 + 'px;}</style>')
```

只要页面运行了上面的代码 `1rem` 就表示当前页面宽度的十分之一。


## 自动计算 rem

在 SCSS 里使用 PX2REM

```sh
npm install -g node-sass
mkdir demo-scss demo-css
touch demo-scss/style.scss
node-sass -wr demo-scss -o demo-css
```
在 scss 文件里添加如下代码，即可实现 px 自动变 rem

```scss
@function px( $px ){
  @return $px/$designWidth*10 + rem;
}

$designWidth : 640; // 640 是设计稿的宽度，你要根据设计稿的宽度填写。如果设计师的设计稿宽度不统一，就杀死设计师，换个新的。

.child{
  width: px(320);
  height: px(160);
  margin: px(40) px(40);
  border: 1px solid red;
  float: left;
  font-size: 1.2em;
}
```

     