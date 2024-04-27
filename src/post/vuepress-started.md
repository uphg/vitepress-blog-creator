---
title: 使用 VuePress 搭建文档
date: 2020-09-01T16:37:32+08:00

tags:
  - Vuepress
---

## 新建一个项目

创建并进入一个新目录

```bash
mkdir vuepress-starter && cd vuepress-starter
```

使用你喜欢的包管理器进行初始化

```bash
yarn init # npm init
```

将 VuePress 安装为本地依赖（不推荐全局安装 VuePress）

```bash
yarn add -D vuepress # npm install -D vuepress
```

创建你的第一篇文档

```bash
mkdir docs && echo '# Hello VuePress' > docs/README.md
```

在 `package.json` 中添加一些 [scripts](https://classic.yarnpkg.com/zh-Hans/docs/package-json#toc-scripts)

这一步骤是可选的，但我们推荐你完成它。在下文中，我们会默认这些 scripts 已经被添加。

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

启动一个本地服务器

```bash
yarn docs:dev # npm run docs:dev
```

## 目录结构

```text
.
├─ docs
│  ├─ README.md                # 首页文档设置
│  └─ .vuepress
│     ├─ components            # 自动全局注册的组件
│     ├─ public                # 存放公共文件，如图片、图标的引入
│     ├─ styles                # 公共样式修改
│     │  ├── index.styl
│     │  └── palette.styl
│     ├─ enhanceApp.js         # 引入外部JS文件
│     └─ config.js             # 默认配置选项
└─ package.json
```

## 导航栏

你可以通过 `themeConfig.nav` 增加一些导航栏链接:

```js
// .vuepress/config.js
module.exports = {
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'External', link: 'https://google.com' }
    ]
  }
}
```

外部链接 `<a>` 标签的特性将默认包含`target="_blank" rel="noopener noreferrer"`，你可以提供 `target` 与 `rel`，它们将被作为特性被增加到 `<a>` 标签上：

```js
// .vuepress/config.js
nav: [
  { text: 'External', link: 'https://google.com', target: '_self', rel: '' },
  { text: 'Guide', link: '/guide/', target: '_blank' }
]
```

当你提供了一个 `items` 数组而不是一个单一的 `link` 时，它将显示为一个 `下拉列表` ：

```js
// .vuepress/config.js
nav: [
  {
    text: 'Languages',
    ariaLabel: 'Language Menu',
    items: [
      { text: 'Chinese', link: '/language/chinese/' },
      { text: 'Japanese', link: '/language/japanese/' }
    ]
  }
]
```

设置下拉列表分组

```js
nav: [
  { text: 'Home', link: '/' },
  {
    text: 'more',
    items: [
      {
        text: 'Group1',
        items: [
          { text: 'one', link: '/one/' },
          { text: 'two', link: '/two/' }
        ]
      },
      {
        text: 'Group2',
        items: [
          { text: 'one', link: '/one/' },
          { text: 'two', link: '/two/' }
        ]
      }
    ]
  }
}
```

## 侧边栏

### 属性说明

**collapsable**

可折叠性，默认可折叠(`true`) 你可以设置 `collapsable: false` 来让一个组永远都是展开状态。

**activeHeaderLinks**

根据滚动激活侧栏标题，默认是 `true`，可设置 `false` 关闭这个选项

### 分离配置文件

你也可以将导航栏与侧边栏的配置单独存放，在 `config.js` 中引入即可

新建一个 `nav.js` 并使用 `module.export` 导出

```js
module.exports = [
  {
    text: 'foo',
    link: '/foo/',
  },
  {
    text: 'bar',
    link: '/bar/',
  },
  {
    text: 'more',
    items: [
      {
        text: 'Group1',
        items: [
          { text: 'one', link: '/one/' },
          { text: 'two', link: '/two/' },
        ]
      },
      {
        text: 'Group2',
        items: [
          { text: 'one', link: '/one/' },
          { text: 'two', link: '/two/' },
        ]
      }
    ]
  }
]
```

新建一个 `sidebar.js` 并使用 `module.export` 导出

```js
module.exports = {
  '/foo/': [
    '', // README.md
    {
      collapsable: false, // 设置侧栏展开
      title: 'foo',
      children: [
        'one', // one.md
        'two', // two.md
        'three' // three.md
      ]
    }
  ],
  '/bar/': [
    '', // README.md
    {
      collapsable: false, // 设置侧栏展开
      title: 'bar',
      children: [
        'one', // one.md
        'two', // two.md
        'three' // three.md
      ]
    }
  ]
}
```

### 一个简单的配置案例

```js
module.exports = {
  base: '/doc/',
  title: 'GunnyBag',
  description: 'Collect frequently used front-end notes',
  /* 在head中添加标签 */
  head: [
    ['script', { src: '/icon.js' }]           // 引入icon图标
  ],
  themeConfig: {
    /* 开启平滑滚动 */
    smoothScroll: true,
    /* 侧栏显示标题深度 */
    sidebarDepth: 0,
    /* 搜索显示条目数 */
    searchMaxSuggestions: 10,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'foo', link: '/foo/' },
      { text: 'bar', link: '/bar/' },
    ],
    sidebar: [
      '/foo/': [
        '',                                // README.md
        {
          collapsable: false,            // 设置侧栏展开
          title: 'foo',
          children: [
            'one',                     // one.md
            'two',                     // two.md
            'three',                   // three.md
          ]
        },
      ],
      '/bar/': [
        '',                                // README.md
        {
          collapsable: false,            // 设置侧栏展开
          title: 'bar',
          children: [
            'one',                     // one.md
            'two',                     // two.md
            'three',                   // three.md
          ]
        },
      ],
    ]
  }
  /* 添加插件 */
  plugins: [
    ['vuepress-plugin-smooth-scroll'],
    ...
  ]
}
```

::: tip 注意

本地侧栏的根路径下必须要有一个 `README.md` 文件，防止无法跳转至该目录。

:::

## 默认样式修改

### palette.styl

如果要对[默认预设](https://github.com/vuejs/vuepress/blob/master/packages/@vuepress/core/lib/client/style/config.styl)的样式进行简单的替换，或者定义一些变量供以后使用，你可以创建一个 `.vuepress/styles/palette.styl` 文件。

你可以调整的一些变量如下:

```stylus
// 颜色
$accentColor = #3eaf7c
$textColor = #2c3e50
$borderColor = #eaecef
$codeBgColor = #282c34
$arrowBgColor = #ccc
$badgeTipColor = #42b983
$badgeWarningColor = darken(#ffe564, 35%)
$badgeErrorColor = #DA5961

// 布局
$navbarHeight = 3.6rem
$sidebarWidth = 20rem
$contentWidth = 740px
$homePageWidth = 960px

// 响应式变化点
$MQNarrow = 959px
$MQMobile = 719px
$MQMobileNarrow = 419px
```

::: tip 注意
你应该**只在**这个文件中定义变量。因为 `palette.styl` 将在根的 stylus 配置文件的末尾引入，作为配置，它将被多个文件使用，所以一旦你在这里写了样式，你的样式就会被多次复制。
:::

### index.styl

VuePress 提供了一种添加额外样式的简便方法。你可以创建一个 `.vuepress/styles/index.styl` 文件。这是一个 [Stylus](http://stylus-lang.com/) 文件，但你也可以使用正常的 CSS 语法。

```stylus
.content {
  font-size 30px
}
```

## 安装插件

### 默认主题自带的插件

- [@vuepress/plugin-active-header-links](https://vuepress.vuejs.org/zh/plugin/official/plugin-active-header-links.html)
- [@vuepress/plugin-nprogress](https://vuepress.vuejs.org/zh/plugin/official/plugin-nprogress.html)
- [@vuepress/plugin-search](https://vuepress.vuejs.org/zh/plugin/official/plugin-search.html)
- [vuepress-plugin-container](https://vuepress.github.io/zh/plugins/container/)
- [vuepress-plugin-smooth-scroll](https://vuepress.github.io/zh/plugins/smooth-scroll/)

> 默认主题自带插件均无需安装，直接配置即可。

### 平滑滚动

默认主题在 `config.js` 配置开启该项即可

```js
module.exports = {
  themeConfig: {
    /* 开启平滑滚动 */
    smoothScroll: true,
  },
}
```

安装

```sh
yarn add -D vuepress-plugin-smooth-scroll
# OR npm install -D vuepress-plugin-smooth-scroll
```

添加配置

```js
// .vuepress/config.js
module.exports = {
  plugins: ['vuepress-plugin-smooth-scroll']
}
```

### 图片点击缩放

安装

```sh
yarn add -D vuepress-plugin-zooming
# OR npm install -D vuepress-plugin-zooming
```

添加配置

```js
module.exports = {
  plugins: [
    [
      'vuepress-plugin-zooming',
      {
        selector: '.page img',
        delay: 1000,
        options: {
          bgColor: 'black',
          zIndex: 10000,
        }
      }
    ]
  ]
}
```

### 自动生成当前页目录

```sh
yarn add -D vuepress-plugin-table-of-contents
# OR npm install -D vuepress-plugin-table-of-contents
```

使用

```js
// .vuepress/config.js
module.exports = {
  plugins: ['vuepress-plugin-table-of-contents']
}
```

该组件会为你注册一个 `<TOC />` 组件，该组件展示你当前页面文章的目录，你可以在 Markdown 文件和 Vue 文件中使用它。

```md
<!-- README.md / Component.vue -->
<TOC />
```

- 官方文档：https://vuepress.github.io/zh/plugins/table-of-contents/

### 根据页面滚动自动激活当前标题

默认主题自带插件

安装

```sh
yarn add -D @vuepress/plugin-active-header-links
# OR npm install -D @vuepress/plugin-active-header-links
```

默认配置

```javascript
module.exports = {
  plugins: [
    '@vuepress/active-header-links',
    {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    }
  ]
}
```

**配合 上面的生成目录 插件使用**

Vue 文件

```vue
<div>
    <TOC class="re-toc" />
</div>
```

配置

```js
module.exports = {
  plugins: [
    '@vuepress/active-header-links',
    { sidebarLinkSelector: '.re-toc a' }
  ]
}
```

当滚动到当前标题时，该标题的目录链接`<a>`标签会添加 `class="router-link-exact-active router-link-active"` 的样式

### 返回顶部

**安装**

```bash
yarn add -D @vuepress/plugin-back-to-top
# OR npm install -D @vuepress/plugin-back-to-top
```

**使用**

```javascript
module.exports = {
  plugins: ['@vuepress/back-to-top']
}
```

### Valine 评论

只支持单个页面引入

安装

```sh
yarn add valine
# or npm install valine
```

创建 `.vuepress/components/MessageLayout.vue` 组件，添加如下内容

```vue
<template>
  <div id="message-valine"></div>
</template>
<script>
export default {
  mounted() {
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      this.window = window
    }
    new Valine({
      el:'#message-valine',
      appId: 'xxx',
      appKey: 'xxx'
    })
  },
};
</script>
```

创建 `docs/message/README.md` 页面，添加如下内容

```md
---
title: 留言板
sidebar: false
---
<MessageValine />
```

在 config.js 中引入该页面

```js
module.exports = {
  themeConfig: {
    sidebar: {
      '/message/': ''
    }
  }
}
```

## 拓展

### 修改默认主题

将 VuePress 默认主题文件拷贝至 `docs/.vuepress/theme`

```sh
vuepress eject docs
```

### 修复不会自动跳转至指定锚点 BUG

在`Layout.vue`中添加以下代码

```js
// ...
export default {
  // ...
  methods: {
    scrollTo(selector) {
      if (!selector || selector === '#') return
      const el = document.querySelector(decodeURIComponent(selector))
      if (el && el.offsetTop) {
        window.scrollTo(0, el.offsetTop)
      }
    }
  },
  mounted() {
    this.scrollTo(location.hash)
  }
}
```

### 自定义页面类

有时候你可能需要为特定页面添加一个 CSS 类名，以方便针对该页面添加一些专门的 CSS。这种情况下你可以在该页面的 YAML front matter 中声明一个 `pageClass`：

```yaml
---
pageClass: custom-page-class
---

```

然后你就可以写专门针对该页面的 CSS 了：

```css
/* .vuepress/override.styl */

.theme-container.custom-page-class {
  /* 特定页面的 CSS */
}
```

### 特定页面的自定义布局

默认情况下，每个 `*.md` 文件将会被渲染在一个 `<div class="page">` 容器中，同时还有侧边栏、自动生成的编辑链接，以及上 / 下一篇文章的链接。如果你想要使用一个完全自定义的组件来代替当前的页面（而只保留导航栏），你可以再次使用 `YAML front matter` 来指定这个组件。

```yaml
---
layout: SpecialLayout
---

```

这将会为当前的页面渲染 `.vuepress/components/SpecialLayout.vue` 布局。

### 使用 Element UI

进入 vuepress 根目录，安装

```sh
yarn add element-ui
# or npm install element-ui
```

在 `.vuepress/enhanceApp.js` 中添加如下配置

```js
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

export default ({ Vue, options, router }) => {
  Vue.use(Element)
}
```

**关于报错**

如果安装后报 `Cannot find module 'core-js/library/fn/object/assign` 等错误信息，可以安装一个如下依赖解决。

```sh
yarn add async-validator
# or yarn add async-validator@1.11.5
```

参考博客：[http://xuedingmiao.com/blog/vuepress_element.html](http://xuedingmiao.com/blog/vuepress_element.html)

## 关于文件路径

### 相对路径

如果想要访问当前项目下的某个文件，可以通过相对路径来访问，如下

```md
[Vue 起手式](./starter.md)
```

> 相对路径的后缀也支持 `./starter` 或 `./starter.html` 但推荐都用 `./starter.md` 。

### 基础路径

如果你的网站会被部署到一个**非根路径**，你将需要在 `.vuepress/config.js` 中设置 `base`，举例来说，如果你打算将你的网站部署到 `https://foo.github.io/bar/`，那么 `base` 的值就应该被设置为 `"/bar/"` (应当总是以斜杠开始，并以斜杠结束)。

有了基础路径（Base URL），如果你希望引用一张放在 .vuepress/public 中的图片，你需要使用这样路径：/bar/image.png，然而，一旦某一天你决定去修改 base，这样的路径引用将会显得异常脆弱。为了解决这个问题，VuePress 提供了内置的一个 helper $withBase（它被注入到了 Vue 的原型上），可以帮助你生成正确的路径：

```html
<img :src="$withBase('/foo.png')" alt="foo">
```

最后补充一句，一个 `base` 路径一旦被设置，它将会自动地作为前缀插入到 `.vuepress/config.js` 中所有以 `/` 开始的资源路径中。
