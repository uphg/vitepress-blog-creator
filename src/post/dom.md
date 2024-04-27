---
title: DOM API
date: 2020-09-14T23:07:31+08:00
tags:
  - JavaScript
  - DOM
---

## 获取 DOM 元素

```js
window.id名 // 通过id获取（无法获取与关键字冲突的id）
document.getElementById('id名') // 通过id获取
document.getElementsByTagName('div') // 通过标签获取（伪数组）
document.getElementsByClassName('part') // 通过class名获取（伪数组）
document.querySelector('#id名')
document.querySelectorAll('.class名')
```

## 获取特定 DOM 元素

- 获取html：`document.documentElement`
- 获取head：`document.head`
- 获取body：`document.body`
- 获取窗口：`window`
- 获取所有元素：`document.all`
- 获取当前焦点元素（focus）：`document.activeElement`。（如果当前没有焦点元素，返回`<body>`元素或null。）


::: tip 注意

这里的`document.all`很奇葩，if 判定为 `false`，但它确实能获取所有元素。
原因主要是这是 IE 发明的一个 API (IE 乃万恶之源)，但是由于其他浏览器模仿跟进该 API，也添加了这个 API。
这样做就会出现一个问题，之前程序员只需要通过判断该 API 是否存在，来区分 IE 与其他浏览器，做兼容性代码，但现在所有浏览器都添加了这个 API，那么之前的代码就没办法区分 IE 浏览器了。于是其他浏览器就做了一个约定，约定`document.all`的执行结果是 `false`。

:::

## 元素的六层原型链

使用 `console.dir()` 传入一个div，可以在控制台打印出一个 div 的结构。其中：

- **第一层** 原型指向 `HTMLDivElement.prototype` 表示所有 div 的共用属性。
- **第二层** 原型指向 `HTMLElement.prototype` 表示所有 HTML 标签的共用属性。
- **第三层** 原型指向 `Element.prototype` 表示所有元素的共用属性（元素包含HTML、XML、SVG等）。
- **第四层** 原型指向 `Node.prototype` 表示所有节点的共用属性（Node）。
- **第五层** 原型指向 `EventTarget.prototype` 其中有一个最重要的方法 `addEventListener`。
- **第六层** 原型指向 `Object.prototype` 就是最底层的对象原型了。

## 节点

在 JavaScript 中，元素和节点是不同的，节点包含了元素、文本、注释等。节点（Node）的类型有很多种，通过节点的 `nodeType` 属性可以获得它的类型，如下

```js
var type = node.nodeType
```

常用的几种类型

- `1` 表示元素(Element)，也叫标签(Tag)
- `3` 表示文本(Text)
- `8` 表示注释(Comment)
- `9` 表示文档(Document)
- `10` 描述文档类型的(DocumentType)节点。例如 `<!DOCTYPE html>` 用于描述 HTML5 的文档类型。
- `11` 表示文档片段 [DocumentFragment](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)

> MDN文档：[Node.nodeType](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType)

## 创建节点

创建一个标签节点

```js
let div = document.createElement('div')
```

创建一个文本节点

```js
let text = document.createTextNode('你好')
```

## 添加节点

在标签中插入文本

```js
div.appendChild(text)
div.innerText = '你好'
div.textContent = '你好'
```

::: tip 注意

默认创建的标签处于 JavaScript 线程中，你必须把它插入到 head 或 body 标签中，它才会生效。可以使用 `document.body.appendChild(div)` 或 `页面中已存在的元素.appendChild(div)` 插入。

:::

### 代码题

页面中有 `div#text1` 和 `div#text2` 两个 div，运行以下代码

```js
let div = document.createElement('div')
text1.appendChild(div)
text2.appendChild(div)
```

请问 div 最终出现在哪里？

1. text1 里
2. text2 里
3. text1 和 text2 里

::: details 答案

选第 2 项 ，只会出现在 text2 中，一个元素不能同时出现在两个地方，除非通过下面的方法(`cloneNode()`)复制一份。

:::

## 克隆节点

可以使用 `cloneNode()` 方法克隆当前节点，克隆之后的节点就是一个新的节点。

`cloneNode()` 默认不传参会只拷贝当前节点（浅拷贝），如果传入 true ，则该节点的所有后代节点也都会被克隆（深拷贝）。

::: tip 注意

该方法会拷贝该节点的所有属性，但是会丧失 `addEventListener` 方法和 `on-属性`（即 `node.onclick = fn` ），添加在这个节点上的事件回调函数。

:::

## 删除节点

```js
// 通过当前元素的父元素删除
Node.parentNode.removeChild(el)

// 自己删除自己
el.remove()
```

::: tip 注意

使用上面两种方式删除，都只是从 DOM 树中删除该节点，它们依然会保存在内存中。

:::

## 交换节点

交换两个子节点，用指定的节点替换当前节点的一个子节点，并返回被替换掉的节点。

```js
replaceChild()
```


## 修改节点属性

```js
元素.id // 修改 id
元素.className // 修改 class
元素.classList.add('red') // 追加 class
```

### 设置 data 属性

带有 `data-` 前缀的属性是一种特殊的自定义属性

```js
let div = document.createElement('div')

// 设置
div.dataset.x = 'jack' // <div data-x="jack"></div>
div.setAttribute('data-x', '123') // <div data-x="123"></div>

// 获取
div.dataset.x  // 123
div.getAttribute('data-x')  // 123
```

### 获取属性

大部分属性都可以通过 `Element.xxx` 获取该属性的值，只有个别属性在获取时会被浏览器加工，比如 a 标签：

获取如下 a 标签的 harf

```html
<a id="test" href="/child">不知名文字</a>
```

示例：

<section class="re-part"> <a id="test" href="/child">不知名文字</a> </section>

获取该标签的 `href` 属性，这时浏览器会帮你自动补全当前的域名。

```js
test.href  // "https://uphg.gitee.io/child"
```

如果你想获取更准确的 `href`，可以这么写

```js
test.getAttribute('href')  // "/child"
```

## `div.onclick` 的原理

`div.onclick` 默认值为 `null`，所以默认点击 div 不会触发任何事件。当你给 div 的 `onclick` 属性附加一个函数 fn，div 被点击时就会执行该函数并这样调用该函数：`fn.call(div, event)`，其中的 div 就是当前被点击的 div，event 就是包含了点击事件的所有信息。

## 修改节点内容

修改文本内容

- `div.innerText = 'xxx'`
- `div.textContent = 'xxx'`

::: info 它们的区别

主要体现在获取文本内容时，textContent 属性返回当前节点和它的所有后代节点的文本内容。而 innerText 只会返回文本内容，不会返回文本前后包裹的空格回车节点。

:::

修改 html 内容

- `div.innerHTML = '<b>文本内容</b>'`

修改标签

- `div.innerHTML = ''`
- `div.appendChild(div2)`

获取文本内容

```js
element.innerText      // 获取的文本不包含回车（text节点），只包含空格（回车会缩进为空格）
element.textContent    // 获取的文本包含回车（text节点）
```

兼容性代码

```js
// 判断textContent是否存在，存在就使用它，不存在就使用innerText
'textContent' in document.body ? document.body.textContent : document.body.innerText
```

## 获取节点

### 获取父节点/元素

```js
Node.parentNode // 获取当前节点的父节点
Node.parentElement // 获取当前节点的父元素
```

### 获取子节点/元素

```js
Node.childNodes // 获取当前节点的所有子节点
Element.firstChild // 获取当前元素的第一个子节点
Element.lastChild // 获取当前元素的最后一个子节点
Element.children // 获取当前元素的所有子元素   
Element.firstElementChild // 获取当前元素的第一个子元素
Element.lastElementChild // 获取当前元素的最后一个子元素
```

### 动态更新子节点信息

上面两种方式获取子节点，当子节点被修改或删除时，它们也会实时变化自己的状态(如 length 属性)，更新子节点信息。但通过 `document.querySelectorAll('div')` 获取的元素，不会根据子节点的变化实时更新自己的状态。案例如下：

假如有如下结构的 ul

```html
<ul id="test">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

使用 `父元素.children` 获取所有 li 子元素后删除一个子元素

```js
let li = test.children
console.log(li.length)  // 3
test.querySelector('li').remove()
console.log(li.length)  // 2
```

使用 `document.querySelectorAll()` 获取所有 li 子元素后删除一个子元素

```js
let li = document.querySelectorAll('li')
console.log(li.length)  // 3
test.querySelector('li').remove()
console.log(li.length)  // 3
```

可以看到，通过 `父元素.children` 打印的结果会跟随子节点的状态实时更新，而通过 `document.querySelectorAll()` 打印的结果始终不会变化。

### 获取兄弟姐妹

```js
Node.previousSibling  // 返回当前节点的上一个兄弟节点，没有则返回 null。
Node.nextSibling      // 返回当前节点的下一个兄弟节点，没有则返回 null。
```

**获取所有兄弟姐妹元素**

```js
const siblings = (el) => {
  const exceptMe = []
  const current = el.parentElement.children
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== el) {
      exceptMe.push(current[i])
    }
  }
  return exceptMe
}

// 使用
siblings(div)
```

**获取所有子孙节点**

假如一个 div 有如下结构

```html
<div id="div">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>
    <div>4.1</div>
    <div>4.2</div>
    <div>
      <div>4.3.1</div>
    </div>
  </div>
  <div>5</div>
</div>
```

遍历上面 div 中的所有子节点

```js
travel = (node, fn) => {
  fn(node)
  if (node.childern) {
    for (let i = 0; i < node.children.length; i++) {
      travel(node.childern[i], fn)
    }
  }
}

// 使用
travel(div, (node) => console.log(node))
```

### 获取标签名称(nodeName)

使用 nodeName 方式获取标签名称，除了 svg 以外的标签都为大写，由于 svg 是新添加的标签，所以显示小写

```js
// 获取当前节点的名称
Node.nodeName
// 获取 <html> 标签的名称相较于其他比较特殊，需要加 .documentElement
document.documentElement.nodeName
```

### 获取节点所在根节点

返回当前节点所在文档的根节点（也就是 `document`，但该方法完全不兼容 IE）

```js
Node.prototype.getRootNode()
```

## 判断节点

**`isEqualNode()` 和 `isSameNode()`**

isEqualNode 表示判断两个节点是否长得一样，isSameNode 表示判断两个节点是否是同一个节点，例如：

```html
<div class="demo"></div>
<div class="demo"></div>
```

```js
let div1 = document.body.children[0]   // 获取第一个 demo
let div2 = document.body.children[1]   // 获取第二个 demo
let result1 = div1.isEqualNode(div2)   // true 长得一样
let result2 = div1.isSameNode(div2)    // false 但是不是同一个节点
let result3 = div1.isSameNode(div1)    // true
```

> 效果链接：https://jsbin.com/jaqadey/1/edit?html,js,output

## 规范化节点

**`normalize()`** 将当前节点和它的后代节点"规范化"。

以下面代码为例，将 wrapper 中先后插入的两个文本节点（Part 1，Part 2）合并为一个文本节点。

```js
let wrapper = document.createElement("div");

wrapper.appendChild( document.createTextNode("Part 1 ") );
wrapper.appendChild( document.createTextNode("Part 2 ") );

// At this point, wrapper.childNodes.length === 2
// wrapper.childNodes[0].textContent === "Part 1 "
// wrapper.childNodes[1].textContent === "Part 2 "

wrapper.normalize();

// Now, wrapper.childNodes.length === 1
// wrapper.childNodes[0].textContent === "Part 1 Part 2 "
```

## 节点中的伪数组

节点都是单个对象，有时需要一种数据结构，能够容纳多个节点。DOM 提供两种节点集合，用于容纳多个节点：`NodeList`和`HTMLCollection`。

这两种集合都属于接口规范。许多 DOM 属性和方法，返回的结果是`NodeList`实例或`HTMLCollection`实例。主要区别是，`NodeList`可以包含各种类型的节点，`HTMLCollection`只能包含 HTML 元素节点。

### NodeList 接口

**获取方式**

- `Node.childNodes`
- `document.querySelectorAll()`等节点搜索方法

**特征**

`NodeList`实例是一个类似数组的对象，它的成员是节点对象。
`NodeList`实例很像数组，可以使用`length`属性和`forEach`方法。但是，它不是数组，不能使用`pop`或`push`之类数组特有的方法。

### HTMLCollection 接口

**获取方式**

返回`HTMLCollection`实例的，主要是一些`Document`对象的集合属性，比如`document.links`、`document.forms`、`document.images`等。如下

```js
// HTML 代码如下
// <img id="pic" src="http://example.com/foo.jpg">

var pic = document.getElementById('pic');
document.images  // 此处返回一个 HTMLCollection 实例
```

**特征**

`HTMLCollection`是一个节点对象的集合，只能包含元素节点（element），不能包含其他类型的节点。它的返回值是一个类似数组的对象，但是与`NodeList`接口不同，`HTMLCollection`没有`forEach`方法，只能使用`for`循环遍历。

**方法**

`HTMLCollection.prototype.namedItem()`

`namedItem`方法的参数是一个字符串，表示`id`属性或`name`属性的值，返回对应的元素节点。如果没有对应的节点，则返回`null`。

```js
// HTML 代码如下
// <img id="pic" src="http://example.com/foo.jpg">

var pic = document.getElementById('pic');
document.images.namedItem('pic') === pic // true
```