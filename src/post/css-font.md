---
title: CSS 字体
---

## text-shadow

#### 1. 实现字体阴影

```css
h2 {
  color: #000;
  text-shadow: 5px 5px 0 #ffc947;
}
```

示例

<section class="re-part">
  <h2 class="text-shadow-demo1">Note</h2>
</section>

#### 2. 实现漫画风格的字体描边

```css
h2 {
  color: #fff;
  text-shadow:
    -.025em -.025em 0 #444,
    .025em -.025em 0 #444,
    -.025em .025em 0 #444,
    .025em .025em 0 #444;
}
```

示例

<section class="re-part">
  <h2 class="text-shadow-demo2">Note</h2>
</section>

<style>
.text-shadow-demo1, .text-shadow-demo2 {
  font-size: 66px;
  border-bottom: none;
  padding: 0;
  margin: 0;
}

.text-shadow-demo1 {
  color: #000;
  text-shadow: 5px 5px 0 #ffc947;
}
.text-shadow-demo2 {
  color: #fff;
  text-shadow:
    -.025em -.025em 0 #444,
    .025em -.025em 0 #444,
    -.025em .025em 0 #444,
    .025em .025em 0 #444;
}
</style>