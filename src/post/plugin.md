---
title: Vue 常用插件

tags:
  - JavaScript
  - Vue
---

## Element UI

### 使用 `el-scrollbar`

```vue
<el-scrollbar wrap-class="scrollbar-wrapper"></el-scrollbar>
```

```css
.el-scrollbar {
  height: 100%;
}
/* 由于 横向滚动条的 bug 可以设置此样式消除 */
.scrollbar-wrapper {
  overflow-x: hidden !important;
}
```

### 去除 focus 样式

- **Drawer 抽屉**

  ```css
  .el-drawer__container:focus,
  .el-drawer.rtl:focus {
    outline: none;
  }
  ```

- **Dropdown 下拉菜单**

  ```css
  .el-dropdown-link:focus {
    outline: none;
  }
  ```

## 引入 Markdown 文件

### 安装

```sh
npm install html-loader markdown-loader --save-dev
```

### 配置

在 `vue.config.js` 添加以下内容

```js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .use('markdown-loader')
      .loader('markdown-loader')
      .end()
  },
}
```

Vue 中使用

```vue
<template>
  <div>
    <div v-html="md"></div>
  </div>
</template>

<script>
import demo from '../../assets/demo.md'
export default {
  data() {
    return {
      md: demo,
    }
  },
}
</script>
```

相关文章：[https://www.cnblogs.com/winyh/p/11934129.html](https://www.cnblogs.com/winyh/p/11934129.html)


## Vue 中使用 Velocity

### 安装

```sh
yarn add velocity-animate
```

### 引入

```js
/* 引入 velocity.js */
import Velocity from 'velocity-animate'
/* 引入 velocity.ui.js */
import 'velocity-animate/velocity.ui.js'
```

### 使用

```js
/* 使用 velocity.js */
Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
/* 使用 velocity.ui.js */
Velocity(el, 'transition.slideLeftBigIn', { stagger: 300 })
```

::: tip 注意

此处 el 可以是单个元素，也可以是 `HTMLCollection`（DOM 元素组成的伪数组）。

:::