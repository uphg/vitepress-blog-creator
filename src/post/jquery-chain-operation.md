---
title: jQuery 中的链式操作
date: 2020-06-16T12:56:26+08:00

tags:
  - jQuery
draft: false
---

通过实现几个 jQuery 中的常用方法来理解 jQuery 链式操作的原理。

## 实现 jQuery 的 addClass 功能

假设给以下 div 添加 class

```html
<div class="test"></div>
<div class="test"></div>
<div class="test"></div>
```

## 封装一个获取元素列表的 jQuery 函数

```js
window.jQuery = function(selector){
  const elements = document.querySelectorAll(selector)
  const api = {
    addClass: function(className){
      for(let i=0; i<elements.length; i++){
        elements[i].classList.add(className)
      }
      return api
    }
  }
  return api
}
```

## 让 jQuery 函数支持链式操作

```js
const demo = jQuery('.test')
// 给 test 追加 red blue yellow
demo.addClass('red').addClass('red').addClass('blue').addClass('yellow')
```

可以直接将上面代码的 api 对象作为函数的 `return` 

```js
window.jQuery = function(selector){
  const elements = document.querySelectorAll(selector)
  return {
    addClass: function(className){
      for(let i=0; i<elements.length; i++){
        elements[i].classList.add(className)
      }
      return this
    }
  }
}
```

## 实现 jQuery 的 find 功能

假设给以下所有 class 名为 test 的子元素添加 `'red'` 的 class

```html
<div class="test">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
<div class="test">
  <div class="item">1</div>
  <div class="item">2</div>
</div>
<div class="test">
  <div class="item">1</div>
</div>
```

在 `window.jQuery` 中添加一个新的 `return` 方法

```js
window.jQuery = function(selectorOrArray) {
  let elements
  /* 判断 selectorOrArray 如果是字符串说明是选择器，就根据选择器做dom处理 */
  if (typeof selectorOrArray === 'string') {
    elements = document.querySelectorAll(selector)
  /* 如果是数组说明是通过.find返回的。就直接返回该数组 */
  } else if (selectorOrArray instanceof Array) {
    elements = selectorOrArray
  }
  return {
    addClass(className) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add(className)
      }
      return this
    },
    /**
      * 接收一个字符串，遍历字符串中的每一项，
      * 将它们追加到一个新的数组中，并在返回的 jQuery 中传入这个数组。
      */
    find(selector) {
      let array = []
      for (let i = 0; i < elements.length; i++) {
        /* 此处 Array.from 表示将伪数组转为数组 */
        const childElements = Array.from(elements[i].querySelectorAll(selector))
        /* concat 表示数组中追加项(可以是一个或多个) */
        array = array.concat(childElements)
      }
      return jQuery(array)
    }
  }
}
```

给所有名为 test 的所有子元素追加一个 'red' 类名

```js
let demo = window.jQuery('.test').find('.item').addClass('red')
console.log(demo)
```

## 简化命名（`$`）

只需要在封装时加入以下代码，就可以使用 `$('.test')` 的方式操作元素。

```js
window.$ = window.jQuery
```

## 实现 `.end()`（返回之前操作的元素）

代码就是在之前的基础上添加以下高亮的代码。

```js {7-9,12,27,32}
window.jQuery = function(selectorOrArray) {
  let elements
  /* 判断 selectorOrArray 如果是字符串说明是选择器，就根据选择器做dom处理 */
  if (typeof selectorOrArray === 'string') {
    elements = document.querySelectorAll(selectorOrArray)
  /* 如果是数组说明是通过.find返回的。就直接返回该数组 */
  } else if (selectorOrArray instanceof Array) {
    elements = selectorOrArray
  }
  return {
    /* 获取之前操作的元素 */
    oldApi: selectorOrArray.oldApi,
    /**
      * 获取当前元素的子元素，根据选择器。
      * 接收一个选择器，根据选择器获取元素组成的数组，
      * 将它们追加到一个新的数组中，并在返回的 jQuery 中传入这个数组。
      */
    find(selector) {
      let array = []
      for (let i = 0; i < elements.length; i++) {
        /* 此处 Array.from 表示将伪数组转为数组 */
        const childElements = Array.from(elements[i].querySelectorAll(selector))
        /* concat 表示数组中追加项(可以是一个或多个) */
        array = array.concat(childElements)
      }
      /* 在数组中存储之前的this */
      array.oldApi = this
      return jQuery(array)
    },
    end() {
      /* 此处的this.oldApi就是之前操作的this */
      return this.oldApi ? this.oldApi :this
    }
  }
}
```

## 实现 `get()`、`each()`、`parent()`、`children()`

代码

```js
window.jQuery = function(selectorOrArray) {
  let elements
  /* 判断 selectorOrArray 如果是字符串说明是选择器，就根据选择器做dom处理 */
  if (typeof selectorOrArray === 'string') {
    elements = document.querySelectorAll(selectorOrArray)
  /* 如果是数组说明是通过.find返回的。就直接返回该数组 */
  } else if (selectorOrArray instanceof Array) {
    elements = selectorOrArray
  }
  return {
    get(index) {
      return elements[index]
    },
    /* 循环当前元素组成的数组 */
    each(fn) {
      if (fn) {
        for(let i = 0; i < elements.length; i++){
          fn.call(null, elements[i], i)
        }
      }
      return this
    },
    // 获取当前元素的父元素
    parent() {
      const array = []
      this.each((node) => {
        if(array.indexOf(node.parentNode) === -1) {
          array.push(node.parentNode)
        }
      })
      return jQuery(array)
    },
    children() {
      const array = []
      this.each((node) => {
        /* if(array.indexOf(node.parentNode) === -1) {
            array.push(...node.children)
        } */
        array.push(...node.children)
      })
      return jQuery(array)
    }
  }
}
```

## 实现 `appendTo()`

and...

## 关于 jQuery 的命名风格

通过 jQuery 获取的对象要使用 $ 开头的变量获取，以便于普通的变量区分。

```js
let $div = $('.test').find('.item')
```

## 拓展

`Array.from()` 表示对数组(或伪数组)做进一步处理，语法：

```js
console.log(Array.from('foo'));
// 输出: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], x => x + x));
// 输出: Array [2, 4, 6]
```

`Array.prototype.concat()` 表示数组拼接(参数可以是单个项或数组)，语法：

```js
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);

console.log(array3);
// 输出: Array ["a", "b", "c", "d", "e", "f"]
```