---
title: 使用 CSS 变量
date: 2021-11-12T14:29:58+08:00
tags:
  - CSS
---

CSS 变量笔记总结。

## 变量的声明

变量声明时，前面要加 `--`

```css
body {
  --foo: #000000;
  --bar: #F7EFD2;
}
```

它们与 `color`、`font-size` 等正式属性没有什么不同，只是没有默认含义。所以 CSS 变量（CSS variable）又叫做 **“CSS 自定义属性”**（CSS custom properties）。因为变量与自定义的 CSS 属性其实是一回事。

你可能会问，为什么选择两根连词线（`--`）表示变量？因为 `$foo` 被 Sass 用掉了，`@foo` 被 Less 用掉了。为了不产生冲突，官方的 CSS 变量就改用两根连词线了。

各种值都可以放入 CSS 变量。

```css
:root{
  --main-color: #4d4e53;
  --main-bg: rgb(255, 255, 255);
  --logo-border-color: rebeccapurple;

  --header-height: 68px;
  --content-padding: 10px 20px;

  --base-line-height: 1.428571429;
  --transition-duration: .35s;
  --external-link: "external link";
  --margin-top: calc(2vh + 20px);
}
```

::: tip

变量名大小写敏感，`--header-color` 和 `--Header-Color` 是两个不同变量。

:::

## `var()` 函数

`var()` 函数用于读取变量。

```css
a {
  color: var(--foo);
  text-decoration-color: var(--bar);
}
```

`var()` 函数还可以使用第二个参数，表示变量的默认值。如果该变量不存在，就会使用这个默认值（仅限于变量未定义时使用）。

```css
:root {
  color: var(--foo, #7F583F);
}
```

第二个参数不处理内部的逗号或空格，都视作参数的一部分。

```css
:root {
  font-family: var(--font-stack, "Roboto", "Helvetica");
  padding: var(--pad, 10px 15px 20px);
}
```

`var()` 函数还可以用在变量的声明。

```css
:root {
  --primary-color: red;
  --text-color: var(--primary-color);
}
```

注意，变量值只能用作属性值，不能用作属性名。

```css
.foo {
  --side: margin-top;
  /* 无效 */
  var(--side): 20px;
}
```

上面代码中，变量 `--side` 用作属性名，这是无效的。

## 变量值的类型

如果变量值是一个字符串，可以与其他字符串拼接。

```css
:root {
  --bar: 'hello';
  --foo: var(--bar)' world';
}
```

利用这一点，可以 debug，如下

```css
body:after {
  content: '--screen-category : 'var(--screen-category);
}
```

如果变量值是数值，不能与数值单位直接连用。

```css
.foo {
  --gap: 20;
  /* 无效 */
  margin-top: var(--gap)px;
}
```

必须使用 `calc()` 函数，将它们连接。

```css
.foo {
  --gap: 20;
  margin-top: calc(var(--gap) * 1px);
}
```

或者更复杂的使用 CSS3 `calc()` 计算，例如：

```css
body {
  --columns: 4;
  --margins: calc(24px / var(--columns));
}
```

如果变量值带有单位，就不能写成字符串。

```css
/* 无效 */
.foo {
  --foo: '20px';
  font-size: var(--foo);
}

/* 有效 */
.foo {
  --foo: 20px;
  font-size: var(--foo);
}
```

如果变量值不合法，会使用继承值或初始值代替，而不是 `var()` 中的默认值，如下

```css
body {
  --color: 20px;
  background-color: #369;
  background-color: var(--color, #cd0000);
}
```

上面的代码会变成

```css
body {
  --color: 20px;
  background-color: #369;
  background-color: transparent;
}
```

所以最后 body 的背景为：`background-color: transparent`

## 作用域

同一个 CSS 变量，可以在多个选择器内声明。读取的时候，优先级最高的声明生效。这与 CSS 的"层叠"（cascade）规则是一致的。

下面是一个[例子](http://jsbin.com/buwahixoqo/edit?html,css,output)。

```html
<style>
  :root { --color: blue; }
  div { --color: green; }
  #alert { --color: red; }
  * { color: var(--color); }
</style>

<p>蓝色</p>
<div>绿色</div>
<div id="alert">红色</div>
```

上面代码中，三个选择器都声明了 `--color` 变量。不同元素读取这个变量的时候，会采用优先级最高的规则，因此三段文字的颜色是不一样的。

这就是说，变量的作用域就是它所在的选择器的有效范围。

```css
body {
  --foo: #7F583F;
}

.content {
  --bar: #F7EFD2;
}
```

上面代码中，变量 `--foo` 的作用域是 `body` 选择器的生效范围，`--bar` 的作用域是 `.content` 选择器的生效范围。

由于这个原因，全局的变量通常放在根元素`:root`里面，确保任何选择器都可以读取它们。

```css
:root {
  --main-color: #06c;
}
```

## 响应式布局

CSS 是动态的，页面的任何变化，都会导致采用的规则变化。

利用这个特点，可以在响应式布局的 `media` 命令里面声明变量，使得不同的屏幕宽度有不同的变量值。

```css
body {
  --primary: #7F583F;
  --secondary: #F7EFD2;
}

a {
  color: var(--primary);
  text-decoration-color: var(--secondary);
}

@media screen and (min-width: 768px) {
  body {
    --primary:  #F7EFD2;
    --secondary: #7F583F;
  }
}
```

## 兼容性处理

```css
a {
  color: #7F583F;
  color: var(--primary);
}
```

也可以使用 [`@support`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@supports) 命令进行检测。

```css
@supports ( (--a: 0)) {
  /* supported */
}

@supports ( not (--a: 0)) {
  /* not supported */
}
```

## JavaScript 操作

JavaScript 也可以检测浏览器是否支持 CSS 变量。

```javascript
const isSupported =
  window.CSS &&
  window.CSS.supports &&
  window.CSS.supports('--a', 0);

if (isSupported) {
  /* supported */
} else {
  /* not supported */
}
```

JavaScript 操作 CSS 变量的写法如下。

```javascript
// 设置变量
document.body.style.setProperty('--primary', '#7F583F');

// 读取变量
document.body.style.getPropertyValue('--primary').trim();
// '#7F583F'

// 删除变量
document.body.style.removeProperty('--primary');
```

这意味着，JavaScript 可以将任意值存入样式表。下面是一个监听事件的例子，事件信息被存入 CSS 变量。

```javascript
const docStyle = document.documentElement.style;

document.addEventListener('mousemove', (e) => {
  docStyle.setProperty('--mouse-x', e.clientX);
  docStyle.setProperty('--mouse-y', e.clientY);
});
```

那些对 CSS 无用的信息，也可以放入 CSS 变量。

```css
--foo: if(x > 5) this.width = 10;
```

上面代码中，`--foo` 的值在 CSS 里面是无效语句，但是可以被 JavaScript 读取。这意味着，可以把样式设置写在 CSS 变量中，让 JavaScript 读取。

所以，CSS 变量提供了 JavaScript 与 CSS 通信的一种途径。

## HTML 标签中设置 CSS 变量

这个应该不难理解

```html
<div style="--color: #1a73e8;">
  <img src="mm.jpg" style="border: 10px solid var(--color);">
</div>
```

## 命名规范

默认情况下，使用：名称 + 属性

```css
body {
  --button-padding: 16px;
  --button-border-color: #C0C4CC;
  --navbar-text-color: #000000;
  --search-bg-color: #ffffff;
}
```

如果附带类型，比如大小，可以使用：名称 + 类型 + 属性

```css
body {
  --button-height: 36px;
  --button-small-height: 32px;
  --button-big-height: 40px;
}
```

## 参考文章

- [CSS 变量教程](http://www.ruanyifeng.com/blog/2017/05/css-variables.html)
- [小 tips：了解 CSS 变量 var](https://www.zhangxinxu.com/wordpress/2016/11/css-css3-variables-var/)