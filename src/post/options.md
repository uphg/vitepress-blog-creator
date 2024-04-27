---
title: "Vue 简介 & 构造选项"
date: 2020-11-24T17:35:00+08:00

tags:
  - Vue
---

## Vue 作者

- 尤雨溪，英文名 Evan You 。
- 本科就读于美国科尔盖特大学，艺术与艺术史专业。
- 帕森设计学院艺术硕士。
- 毕业后在 Google Creative Lab 担任 UI 相关工作。
- 后来转为全职 JavaScript 开发工程师。
- 现为独立开发者，靠每个月几十万以上的 [捐款](https://www.patreon.com/evanyou)生活，还有 [其他赞助](https://opencollective.com/vuejs)。
- [Linkedin 主页](https://www.linkedin.com/in/evanyou)、[GitHub 主页](https://github.com/yyx990803)、[个人域名](https://evanyou.me/)。

## Vue 完整版与运行时（runtime）版本的区别

**完整版** Vue 自带一个 compiler 函数，可以将类似 `<div>{{n}}</div>` 的代码转换为类似 `h('div', this.n)` 这样的代码（虚拟 DOM）。相当于自带编译器。

**运行时（runtime）** 版本没有 compiler 的功能，而是直接使用 webpack 提供的 Vue Loader。Vue Loader 中自带了 compiler 函数的功能，在你编译代码的时候，将代码编译为可以运行的版本。

这样做的好处就是，运行时版本比完整版的体积少了30%左右。

其中 `h('div', this.n)` 指的是一个函数，可以根据传入的参数创建 DOM 节点，俗称**虚拟 DOM**。

## SEO 搜索引擎优化

搜索引擎会根据页面默认显示的内容来获取页面的关键字（页面默认不会显示包括 JS 创建的内容）
- title 表示页面名称。
- description 表示页面的描述。
- keyword 表示页面的关键字。
- h1 表示页面主要内容的标题。
- 页面中的 a 标签（搜索引擎会根据 a 标签链接获取与此网站相关网站的信息）。

示例网站

```html
<head>
  <!-- 页面名称 -->
  <title>京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！</title>
  <!-- 移动端适配 -->
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"
  >
  <!-- 描述 -->    
  <meta name="description" content="京东JD.COM-专业的...">
  <!-- 关键词 -->    
  <meta name="Keywords" content="网上购物,网上商城,手机...">
</head>
<body>
  <h1>京东</h1>
  <p>友情链接：</p>
  <a href="https://www.taobao.com">淘宝</a>
  <a href="https://www.mi.com/">小米商城</a>
</body>
```

## Vue 的构造选项

- **数据**
  
  `data`、`props`、`propsData`、`computed`、`methods`、`watch` 。

- **DOM**
  
  `el`、`template`、`render`、`renderError` 。

- **生命周期钩子**
  
  `beforeCreate`、`created`、`beforeMount`、`mounted`、`beforeUpdate`、`updated`、`activated`、`deactivated`、`beforeDestroy`、`destroyed`、`errorCaptured` 。

- **资源**
  
  `directives`、`filters`、`components` 。
  
- **组合**
  
  `parent`、`mixins`、`extends`、`provide`、`inject` 。

- **其他**
  
  `name`、`delimiters`、`functional`、`model`、`inheritAttrs`、`comments` 。

## Vue 初始化实例

挂载 Vue 实例有两种方式：

1. 通过实例的 `vm.$mount()` 方法

    ```js
    import Vue from "vue";
    import App from "./App.vue";

    new Vue({
      render: (h) => h(App)
    }).$mount("#app");
    ```

2. 通过 `render()` 函数

    ```js
    import Vue from "vue";
    import App from "./App.vue";

    new Vue({
      el: "#app",
      render: (h) => h(App)
    });
    ```

## 组件中的 data 只支持函数 return 对象

假设你引用了一个 `Demo.vue` 文件，并使用 `import Demo from './Demo.vue'` 导出了它，此时的 Demo 其实是一个对象。

每次在其他 Vue 文件中引入这个 Demo 的时候，Vue 都会通过 `new Vue(Demo)` 将它封装为一个 Vue 实例。

如果将 `data` 直接写成对象，那么每次 `new Vue(Demo)` 封装的就是同一个对象，只要其中一个对象的数据(`data`)改变，其他也会跟着改变，这样每个组件本质上还是使用了一个 `data` 。

但是如果你使用 `data(){ return {} }` 的方式，那么每次 `new Vue` 的时候，都会先调用 `data()` 函数，而 `data()` 函数每次返回的对象都是一个独立的对象。

代码示例

```js
import Demo1 from "./Demo.vue";
import Demo2 from "./Demo.vue";
export default {
  components: {
    Demo1, // 相当于 new Vue(Demo1)
    Demo2, // 相当于 new Vue(Demo2)
  }
};
```

## 生命周期钩子

常用的几种生命周期钩子示例

```js
export default {
  created() {
    /* 实例出现在内存中 */
  },
  mounted() {
    /* 实例出现在页面中 */
  },
  updated() {
    /* 实例更新了 */
  },
  beforeDestroy() {
    /* 实例销毁之前调用。在这一步，实例仍然完全可用。 */
  },
  destroyed() {
    /* 实例被销毁（从页面和内存中消亡） */
  }
};
```

## 拓展内容

### 命令行打开目录

运行 `start .` 可以快捷打开当前目录。

### 快速创建一个项目

1. 打开 [https://codesandbox.io](https://codesandbox.io/)
2. 注意不要登录该网站，登录后会有项目创建限制（50个），不登录可以创建无限个项目。
3. 选择「Create a Sandbox, it’s free」，然后选择 Vue。

### 什么是 SSR

SSR 就是不要用客户端的 JS 渲染内容，而是用服务端的 JS 渲染内容。

### 什么是 SSR 搜索引擎优化

就是通过服务端渲染 HTML 页面。
