---
title: CSS 常用属性
date: 2020-05-20T16:06:52+08:00
tags:
  - CSS
---

记录一下我使用过的一些 CSS 样式

## CSS3 盒模型

通常情况可以全局使用

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

## 去除默认样式

### a 链接默认下划线 & 字体颜色继承

```css
a {
  color: inherit; /* 颜色继承父元素 */
  text-decoration: none; /* 去掉下划线 */
}
```

### 表单/按钮 focus 默认状态

```css
button {
  outline: none;
}
```

### textarea 大小不可拖动

```css
textarea {
  overflow: hidden;
  resize: none; /* 设置大小不可拖动 */
}
```

### 图片文字中线对齐

```css
img {
  vertical-align: middle;
}
```

### 滤镜灰色图片

```scss
img {
  cursor: pointer;
  filter: contrast(0%);
  transition: filter 0.3s;
  &:hover {
    filter: contrast(100%);
  }
}
```

### Chrome 浏览器滚动条样式

```css
*::-webkit-scrollbar {
  /* 滚动条整体样式 */
  width: 8px; /* 定义纵向滚动条宽度 */
  height: 8px; /* 定义横向滚动条高度 */
}

*::-webkit-scrollbar-thumb {
  /* 滚动条内部滑块 */
  border-radius: 8px;
  background-color: hsla(220, 4%, 58%, 0.3);
  transition: background-color 0.3s;
}

*::-webkit-scrollbar-thumb:hover {
  /* 鼠标悬停滚动条内部滑块 */
  background: #bbb;
}

*::-webkit-scrollbar-track {
  /* 滚动条内部轨道 */
  background: #ededed;
}
```

### 重置透明背景（设置背景为 `none` 或 `transparent`）

```css
div {
  background-color: none;
  background-color: transparent;
}
```

### 背景图片居中等比例缩放

```css
body {
  background: url(../img/rs-cover.jpg);
  /* 背景图片水平居中，垂直居中 */
  background-position: center center;
  /* 按照div的比例缩放 */
  background-size: cover;
}
```

## CSS 常用语法

### 媒体查询

表示最小宽度为 100px 最大宽度为 200px 的设备：

```css
@media (min-width: 100px) and (max-width: 200px) {
  body {
    属性: 值;
  }
}
```

### 设置 PDF 样式

在 `@media print` 中的样式只会在 PDF 格式下生效

```css
@media print {
  body {
    background: red;
  }
}
```

### transition 动画过渡

当前元素所有动画平滑过渡 时间 0.3 秒

```css
transition: all 0.3s;
```

指定属性过渡

```css
transition: width 2s; /* 宽度添加过渡效果 2s */
```

> [transition - MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)

### transform 动画

**移动位置**括号内表示坐标 (X 轴 Y 轴)，单位可以使用百分比 ( 百分比根据自身 )

```css
transform: translate(120px, 50%);
```

**放大缩小**括号内表示坐标 (X 轴 Y 轴)

```css
transform: scale(2, 2); /* 放大 */
transform: scale(0.3, 0.3); /* 缩小 */
```

**拉伸**

```css
transform: skew(30deg, 0deg); /* 括号内参数(x轴，y轴) */
```

### animation 动画

过渡效果

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.element {
  animation: spin 1.2s slidein linear;
}
```

### CSS 变量

以设置字体变量为例：

```css
/* 声明变量 */
:root {
  --font-size: 14px;
}
/* 使用变量 */
p {
  font-size: var(--font-size);
}
```

::: info 提示

`:root` 表示作用域，可以改为 html，或上面案例中的 p 标签

:::

### 计算属性

计算属性可以让 CSS 支持支持 `+`、`-`、`*`、`/` 运算

```css
/* 语法 property: calc(expression) */
width: calc(100% - 80px);
```

::: tip 注意

`+` 和 `-` 运算符的两边必须要有空白字符。

`*` 和 `/` 这两个运算符前后不需要空白字符，但如果考虑到统一性，仍然推荐加上空白符。

:::

### 设置编码格式

`@charset` 必须写在最顶部

```css
@charset "UTF-8";
```

### 引入其他文件

`@import` 是引入其他 CSS 文件

```css
@import url(style.css);
```

::: tip 注意

`@charset` 和 `@import` 结尾必须加分号

`@import` 的性能较低，通常推荐使用 JS 中的模块化（`import 'style.css'`）引入

:::

## CSS 文本处理

### 文本省略

一行的多余文字省略

```css
p {
  border: 1px solid #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

多行的多余文字省略（在第二行后加省略，第二行后的内容会被隐藏）：

```css
p {
  border: 1px solid #ccc;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 禁止文本选中

```css
p {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
```

### 字符编码

```html
空格符：&nbsp;
```

### 连续字母换行

有时多个连续的英文字母即时用内联元素包裹也无法换行，如下：

```html
<div><span>ccccccccccccccccccccccccccccccc</span></div>
```

这时给 div 添加以下属性

```css
div {
  word-break: break-all;
}
```

连续字母就可以换行了

效果链接：[http://js.jirengu.com/hehatujuwe/1/edit](http://js.jirengu.com/hehatujuwe/1/edit)

### 解决定位时文字竖直排列

当一个内联元素绝对定位时，会竖直排列，而不是正常横向排列给内联元素添加以下属性即可

```css
p {
  white-space: nowrap;
}
```

### 使 pre 标签自动换行

默认情况下，在 pre 标签中的内容是不会自动换行的，添加以下属性即可像其他元素一样实现根据元素宽度换行。

```css
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
```

### CSS 字母大写

添加以下属性

```css
p {
  text-transform: uppercase;
}
```

### 文字两边对齐

```css
span {
  border: 1px solid green;
  display: inline-block;
  width: 5em;
  text-align: justify;
  line-height: 20px;
  overflow: hidden;
  height: 20px;
}
span::after {
  content: '';
  display: inline-block;
  width: 100%;
  border: 1px solid blue;
}
```

```html
<span>姓名</span><br data-tomark-pass />
<span>联系电话</span>
```

> 原理主要由 `text-align: justify;` 属性，配合 `::after` 实现

## 布局案例

### 快速实现[左　右右]布局

使用 flex 布局 中的 `justify-content: space-between;` 加 `margin-left: auto;` 实现

效果：

<div class="re-part">
  <div class="parent">
    <div class="item1 block"></div>
    <div class="item2 block"></div>
    <div class="item3 block"></div>
  </div>
</div>


代码：

```html
<div class="parent">
  <div class="item1 block"></div>
  <div class="item2 block"></div>
  <div class="item3 block"></div>
</div>
```

```css
.parent {
  display: flex;
  justify-content: space-between;
  background-color: #eeeeee;
  padding: 5px;
}
.block {
  width: 100px;
  height: 100px;
  background-color: #e88024;
}
.item2 {
  margin-left: auto;
  background-color: #89479b;
}
```

## 拓展

- 其他技巧，谷歌搜索：`css multiline text ellipsis`
- 更多 CSS 样式教程：[https://css-tricks.com/line-clampin/](https://css-tricks.com/line-clampin/)
- 需要查找特定 CSS 样式可以使用 Google 搜索 `CSS tricks 关键词`
- CSS 案例参考：https://cn.365psd.com/

<style scoped>
.word {
	 width: 175px;
	 height: 200px;
	 border-radius: 12px;
	 background-color: #1e91f2;
	 position: relative;
}
 .word-top-right {
	 position: absolute;
	 top: 0;
	 right: 0;
	 width: 50px;
	 height: 50px;
	 background-color: #85c3f8;
	 border-bottom-left-radius: 12px;
}
 .word-top-right::before {
	 content: '';
	 display: block;
	 height: 0;
	 position: absolute;
	 top: -39px;
	 right: -41px;
	 border-color: #fff transparent transparent transparent;
	 border-width: 38px 38px 38px 38px;
	 border-style: solid;
	 transform: rotate(-135deg);
}
 .word-text {
	 font-family: "Yu Gothic UI", "等线";
	 color: #fff;
	 font-size: 100px;
	 font-weight: bold;
	 height: 100%;
	 display: flex;
	 justify-content: center;
	 align-items: center;
}
 .re-part .parent {
	 display: flex;
	 justify-content: space-between;
	 background-color: #eee;
	 padding: 5px;
}
 .re-part .block {
	 width: 100px;
	 height: 100px;
	 background-color: #e88024;
}
 .re-part .item2 {
	 margin-left: auto;
	 background-color: #89479b;
}
</style>
