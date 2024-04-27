---
title: CSS 不正交
date: 2019-09-01T09:06:34+08:00
tags:
  - CSS
---

## `margin` 属性合并

### 兄弟元素之间

在默认情况下两个 div 之间的 margin 属性会重合，例如：

CSS

```css
main {
  border: 1px solid blue;
}
div {
  border: 1px solid red;
  height: 100px;
  margin: 10px;
}
```

HTML

```html
<main>
  <div></div>
  <div></div>
  <div></div> 
</main>
```

图示：

![图片](/images/CSS-Layout_01.jpg)

但假如在其中插入一个带有 `border: 1px solid black;` 的 div 时，margin 又会被撑开，如图：

![图片](/images/CSS-Layout_02.jpg)

> 即使插入的 div 边框为 0.1px 其他div的margin也会受到影响，其他会影响margin的属性还有: `display: table;`，`display: flex` 等

代码链接：http://js.jirengu.com/giqanalumi/10/edit?html,output

### 父子元素之间

当子元素带有 margin-top 父元素没有 margin-top 时，父元素也会被顶下去，如下： 

HTML

```html
<main>
  <div class="parent">
    <div class="child"></div>
  </div>
</main>
```

CSS

```css
main {
  border: 1px solid blue;
  padding: 5px;
}
.child {
  height: 100px;
  width: 100px;
  background-color: #ff0000;
  margin-top: 100px; 
}
.parent {
  background-color: #000;
}
```

图示：

![图片](/images/CSS-Layout_03.jpg)

**给上面的父元素添加一个 `border-top: 5px solid green;`，子元素就会撑开父元素了，如图：**

![图片](/images/CSS-Layout_04.jpg)

除了加 border 属性，还可以添加: `padding`  `display: inline-block;`  `display: flex;`  `display: table;`  `overflow: hidden;` 等

>  如果在有 margin 属性的子元素上添加一个内联元素，那么 margin 也不会影响父元素布局

代码链接：http://js.jirengu.com/cimunikafi/2/edit

## 2. `li` 小圆点受 `display` 影响

当修改 li 的 display 属性时 li 的小圆点就会消失，如下：

HTML

```html
<ul>
  <li>选项1</li>
  <li>选项2</li>
  <li>选项3</li>
</ul> 
```

CSS

```css
ul {
  border: 1px solid #000;
}
li {
  display: block;
}
```

图：

![图片](/images/CSS-Layout_05.jpg)

> 原因：由于默认的 li 的默认 display 属性为： `list-item`  小圆点只会显示在有这个属性的元素上

代码链接：http://js.jirengu.com/kiciminufa/1/edit

## 3. `position` 会影响 `dispaly` 属性

HTML

```html
<div class="parent">
  <div class="child">内联样式</div>
</div>
```

CSS

```css
.parent {
  background: yellow;
  height: 100px;
  position: relative;
}
.child {
  display: inline;
  border: 1px solid red;
  position: absolute;
  bottom: 0;
  right: 0;
}
```

此时打开控制台选中 child 元素 在控制台右侧选择 Computed 一栏 搜索 display ，就可以看到实际上child 的 display 属性变成了 block ，如图：

![图片](/images/CSS-Layout_06.jpg)

> 注意：只有当 display 的属性为 inline 或者 inline-block 时添加 position 属性才会被变为 block

代码链接：http://js.jirengu.com/yucujokate/1/edit

## 4. `position: fixed` 受 `transform` 影响

当给有 `position: fixed` 属性的父元素或祖先元素一个 transform 属性时 `position: fixed` 就不会相对屏幕定位，而是相对那个父元素或祖先元素定位，如下：

HTML

```html
<main>
  <div class="demo"></div>
</main>
```

CSS

```css
main {
  width: 200px;
  height: 200px;
  border: 1px solid blue;
  transform: translate(10px, 50px);
}
.demo {
  width: 100px;
  height: 100px;
  background-color: red;
  position: fixed;
  right: 5px;
  top:50px;
}
```

图示：

![图片](/images/CSS-Layout_07.jpg)

代码链接：http://js.jirengu.com/zesiyopemi/2/edit

## 5. `float` 元素会影响周围的 `inline` 元素

HTML

```html
<div class="parent">
  <div class="float">浮动元素</div>
  <div class="child">文字元素</div>
</div>
```

CSS

```css
.parent {
  background: blue;
  height: 100px;
}
.float {
  background: rgba(255, 0, 0, 0.5);
  width: 100px;
  height: 60px;
  float: left;
}
.child {
  width: 300px;
  height: 50px;
  background: white;
}
```

这时 float 元素就会影响兄弟元素里的 inline 元素，如图：

![图片](/images/CSS-Layout_08.jpg)

代码链接：http://js.jirengu.com/bojacipogu/10/edit

**拓展：浮动最初的作用**

浮动开始只是为了让图文混排出现的，当在一段文字中插入一个图片，文字默认是与图片底线对齐的。很不美观，于是就出现了 `float: left` 等属性，可以显示图片又使文字排版美观
