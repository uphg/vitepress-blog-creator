---
title: 七种方式实现垂直居中
date: 2020-05-29T15:09:31+08:00
tags:
  - CSS
---

## 1. table 自带属性

```html
<table class="parent">
  <tr>
    <td class="child">你知道就算大雨让这座城市颠倒，我会给你怀抱。</td>
  </tr>
</table>
```

```css
.parent {
  border: 2px solid #999999;
  height: 500px;
}
.child {
  border: 2px solid blue;
}
```

预览链接：[https://jsbin.com/horaxaz/2/edit?html,css,output](https://jsbin.com/horaxaz/2/edit?html,css,output)

## 2. 将 div 伪装成 table

```html
<div class="table">
  <div class="td">
    <div class="child">你知道就算大雨让这座城市颠倒，我会给你怀抱。</div>
  </div>
</div>
```

```css
.table {
  display: table;
  border: 2px solid blue;
  height: 500px;
}
/* tr可不写 */
.tr {
  display: table-row;
  border: 2px solid red;
}
.td {
  display: table-cell;
  border: 2px solid orange;
  vertical-align: middle;
}
.child {
  border: 6px solid #6b69d6;
}
```

预览链接：[https://jsbin.com/xacoyad/3/edit?html,css,output](https://jsbin.com/xacoyad/3/edit?html,css,output)

---

以下的案例 HTML 的部分默认都为以下格式

```html
<div class="parent">
  <div class="child">你知道就算大雨让这座城市颠倒，我会给你怀抱。</div>
</div>
```

## 3. 100% 高度的 after before 加上 inline block

其中的 after before 也可用内联元素(如：span)代替

```css
.parent {
  height: 400px;
  border: 2px solid blue;
  text-align: center;
}
.child {
  width: 200px;
  border: 2px solid red;
}
.parent::after,
.parent::before {
  content: "";
  outline: 2px solid orange;
  height: 100%;
}
.parent::before,
.parent::after,
.child {
  display: inline-block;
  vertical-align: middle;
}
```

预览链接：[https://jsbin.com/tahepay/edit?html,css,output](https://jsbin.com/tahepay/edit?html,css,output)

## 4. `margin-top` 加定位 `-50%`

```css
.parent {
  height: 500px;
  border: 1px solid red;
  position: relative;
}

.child {
  width: 300px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -150px;
  border: 1px solid blue;
}
```

预览链接：[https://jsbin.com/quralac/3/edit?html,css,output](https://jsbin.com/quralac/3/edit?html,css,output)

## 5. translate -50%

```css
.parent {
  height: 500px;
  border: 1px solid red;
  position: relative;
}
.child {
  border: 1px solid blue;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

预览链接：[https://jsbin.com/navehiw/2/edit?html,css,output](https://jsbin.com/navehiw/2/edit?html,css,output)

## 6. absolute margin auto

```css
.parent {
  height: 500px;
  border: 1px solid red;
  position: relative;
}
.child {
  width: 300px;
  height: 200px;
  border: 1px solid blue;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
```

预览链接：[https://jsbin.com/gumagaw/2/edit?html,css,output](https://jsbin.com/gumagaw/2/edit?html,css,output)

## 7. 使用 flex 布局

```css
.parent {
  height: 500px;
  border: 2px solid orange;
  display: flex;
  justify-content: center;
  align-items: center;
}
.child {
  border: 2px solid blue;
  width: 260px;
}
```

预览链接：[https://jsbin.com/xezigec/edit?html,css,output](https://jsbin.com/xezigec/edit?html,css,output)
