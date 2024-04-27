---
title: Vue 模板、指令与修饰符
date: 2020-12-04T17:10:22+08:00

tags: 
  - Vue
---

## 模板的三种写法

### 直接放在HTML中（完整版）

如果引入的是Vue完整版，可以直接在带有指定 id 的 div 中书写模板，随后将这个 id 传入 new Vue 中即可。

```html
<div id="xxx">
  {{n}}
  <button @click="add">+1</button>
</div>
```

```js
new Vue({
  el: '#xxx',
  data: {n: 0},
  methods: {
    add() { }
  }
})
```

### 通过 template 属性传入（完整版）

可以事先指定一个带有 id 的 div，在 new Vue 的时候传入的 template 属性中书写模板。

```html
<div id="app"></div>
```

```js
new Vue({
  template: `
    <div>
      {{n}}
      <button @click="add">+1</button>
    </div>`,
  data: {
    n: 0,
  },
  methods: {
    add() { this.n += 1 }
  }
}),$mount('#app')
```

::: tip 注意

此处 HTML 中的 div#app 会在渲染时被替代

:::

### 配合 xxx.vue 文件（非完整版）

```vue
<template>
  <div>
    {{n}}
    <button @click="add">+1</button>
  </div>
</template>
```

```vue
<script>
export default {
  data() {
    return { n: 0 }
  },
  methods: {
    add() { this.n += 1 }
  }
}
</script>
```

然后挂载到页面中

```js
import Xxx from './xxx.vue'

new Vue({
  render: h => h(Xxx)
}).$mount('#app')
```

### 关于 template 标签

在 template 标签中的内容都是 XML 标签，XML 的语法相对 HTML 更加严格，它们的区别如下：

在XML 中，单标签必须添加 `/>` 自闭和。

```html
<!-- HTML中 -->
<input name="user">
<!-- XML中 -->
<input name="user" />
```

在 XML 中，不论什么标签，如果没有内容，都可以自闭和。

```html
<!-- HTML中 -->
<div></div>
<!-- XML中 -->
<div />
```


## Vue 指令

Vue 指令指的是 template 模板中带有 `v-` 前缀的属性

### `v-once`

- **用法：**

  只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

- **示例：**

  ```html
  <!-- 单个元素 -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- 有子元素 -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- 组件 -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` 指令-->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

### `v-cloak`

- **用法：**

  这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

- **示例：**

  ```css
  [v-cloak] {
    display: none;
  }
  ```
  ```vue
  <div v-cloak>
    {{ message }}
  </div>
  ```

### 更多指令

- [**`v-slot`**](https://cn.vuejs.org/v2/guide/components-slots.html) 插槽。
- [**`v-pre`**](https://cn.vuejs.org/v2/api/#v-pre) 直接渲染元素中的内容，不做任何处理。

## 修饰符

### 常用的修饰符

- **`.stop`** 表示阻止事件传播/冒泡。
- **`.prevent`** 表示阻止默认动作（事件）。
- **`.stop.prevent`** 同时启用两种效果（有先后顺序）。

### 按键修饰符

在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 `v-on` 在监听键盘事件时添加按键修饰符：

```vue
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```

你可以直接将 [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。

```vue
<input v-on:keyup.page-down="onPageDown">
```

在上述示例中，处理函数只会在 `$event.key` 等于 `PageDown` 时被调用。

参考文档：[按键修饰符](https://cn.vuejs.org/v2/guide/events.html#按键修饰符)

### `.sync` 修饰符

假如我们要在 Vue 中实现通过子元素操作父元素的值，通常要用以下方式：

父元素

```vue
<div class="app">
  App.vue 我现在有 {{total}}
  <hr>
  <Child :money="total" v-on:update:money="total = $event" />
</div>
```
```js
import Child from "./Child.vue";
export default {
  data() {
    return { total: 10000 };
  },
  components: { Child: Child }
};
```

子元素

```vue
<div class="child">
  {{money}}
  <button @click="$emit('update:money', money-100)">
    <span>花钱</span>
  </button>
</div>
```
```js
export default {
  props: ["money"]
};
```

`.sync` 修饰符就是这个场景下诞生的一种语法糖，它可以将上面父元素的操作简化为如下形式：

```vue {4}
<div class="app">
  App.vue 我现在有 {{total}}
  <hr>
  <Child :money.sync="total"/>
</div>
```

也就是将 `:money="total" v-on:update:money="total = $event"` 简化为 `:money.sync="total"`

关于案例中的参数

- `$emit` 表示触发事件，可以传参，类似 `event.emit` 。
- `$event` 可以获取 `$emit` 的参数。
- `update:xxx` 是一种规定的固定写法，并没有什么特殊含义。

> 其实 .sync 修饰符的实现原理跟 `v-model` 指令有点类似，详细查看：[Vue 表单与输入绑定](./form-and-model.md)