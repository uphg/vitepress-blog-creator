---
title: BFC 是什么
date: 2020-07-01T16:36:50+08:00
tags:
  - CSS
---

## BFC 的定义

BFC是没有一个明确的定义的，它是通过特定的属性所反映的一种状态。

### CSS 规范的定义

浮动，绝对定位的元素，非block的block容器(如：inline-block, `table-cells`和`table-captions`)，`overflow`不为 `visible` 的块会为它们的内容建立一个新的块级格式化上下文(BFC)

### MDN 的定义

通俗点讲，就是当元素具有以下特点之一，就称该元素BFC了

- 根元素(`<html>`)
- 浮动元素（元素的 [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 不是 `none`）
- 绝对定位元素（元素的 [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 为 `absolute` 或 `fixed`）
- 行内块元素（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `inline-block`）
- 表格单元格（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)为 `table-cell`，HTML表格单元格默认为该值）
- 表格标题（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `table-caption`，HTML表格标题默认为该值）
- 匿名表格单元格元素（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)为 `table`、`table-row`、 `table-row-group`、`table-header-group`、`table-footer-group`（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 `inline-table`）
- [`overflow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow) 值不为 `visible` 的块元素
- [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 值为 `flow-root` 的元素
- [`contain`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain) 值为 `layout`、`content`或 paint 的元素
- 弹性元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)为 `flex` 或 `inline-flex`元素的直接子元素）
- 网格元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)为 `grid` 或 `inline-grid` 元素的直接子元素）
- 多列容器（元素的 [`column-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-count) 或 [`column-width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-width) 不为 `auto`，包括 `column-count` 为 `1`）
- `column-span` 为 `all` 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（[标准变更](https://github.com/w3c/csswg-drafts/commit/a8634b96900279916bd6c505fda88dda71d8ec51)，[Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=709362)）。

## BFC 是什么

### BFC可以清除浮动，使父元素可以包裹浮动的子元素

代码

```html
<div class="parent">
    <div class="childe">
        childe
        <div class="demo">demo</div>
    </div>
</div>
```

```css
.parent {
    border: 3px solid #ccc;
    display: flow-root;
}
.childe {
    width: 200px;
    background-color: #e9eef3;
    float: left;
}
.demo {
    width: 100px;
    height: 50px;
    margin-top: 100px;
    background-color: #b3c0d1;
}
```

效果图

![图片](/images/bfc-demo1.jpg)

代码链接: [https://jsbin.com/kobeyes/edit?html,css,output](https://jsbin.com/kobeyes/edit?html,css,output)

### BFC 可以使浮动元素与它的兄弟元素不重叠

代码

```html
<div class="item1">item1</div>
<div class="item2">item2</div>
```

```css
div { padding: 1em; }
.item1 {
    width: 100px;
    min-height: 400px;
    background-color: #b3c0d1;
    float: left;
    margin-right: 5px;
}
.item2 {
    min-height: 400px;
    background-color: #e9eef3;
    display: flow-root;
}
```

效果图

![图片](/images/bfc-demo2.jpg)

代码链接: [https://jsbin.com/tiqagab/edit?html,css,output](https://jsbin.com/tiqagab/edit?html,css,output)

## 关于`display: flow-root`属性

它的作用就是将当前元素变为BFC元素。相对其他方式，此方式没有其他副作用，只有这个功能。

上面例子中的 `display: flow-root` 都可以替换为上文中具有BFC的其他属性，如：

```css
overflow: hidden/auto; 
display: inline-block; 
float: left;
...
```

参考文档

- [块级格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)