---
title: 使用 Vue CLI 创建项目
date: 2020-11-25T22:07:22+08:00

tags: 
  - Vue
---

## 创建脚手架

安装 Vue CLI

```sh
yarn global add @vue/cli-service-global
# or npm install -g @vue/cli-service-global
```

创建一个项目

```sh
vue create hello-world
```

选择第三项自定义配置

```sh
? Please pick a preset: (Use arrow keys)
  Default ([Vue 2] babel, eslint)
  Default (Vue 3 Preview) ([Vue 3] babel, eslint)
> Manually select features
```

选择以下依赖

```sh
? Check the features needed for your project:
 (*) Choose Vue version
 (*) Babel
 ( ) TypeScript
 ( ) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
>(*) CSS Pre-processors
 (*) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing
```

选择 Vue 版本（选择2.x）

```sh
? Choose a version of Vue.js that you want to start the project with (Use arrow keys)
> 2.x
  3.x (Preview)
```

选择是否使用 history 路由（默认启用即可）

```sh
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)
```

选择一个 CSS Loader（默认第一项即可）

```sh
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): (Use arrow keys)
> Sass/SCSS (with dart-sass)
  Sass/SCSS (with node-sass)
  Less
  Stylus
```

选择 ESLint 配置（选择 ESLint + Prettier）

```sh
? Pick a linter / formatter config:
  ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
> ESLint + Prettier
```

在什么时候检查代码错误（文件保存时/提交代码时）

```sh
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Lint on save
 ( ) Lint and fix on commit
```

插件配置存放在哪里（默认第一项即可）

```sh
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
> In dedicated config files
  In package.json
```

是否保存当前配置为以后的项目使用（选择默认N）

```sh
? Save this as a preset for future projects? (y/N)
```

## 配置代码格式化

首先 VSCode 需要安装 ESLint 及 Prettier 插件（WebStorm 自带）

在项目根目录创建 `.prettierrc` 添加以下内容

```js
{
  /* 使用单引号包含字符串 */
  "singleQuote": true,
  /* 不添加行尾分号 */
  "semi": false,
  /* 在对象属性添加空格 */
  "bracketSpacing": true,
  /* 优化html闭合标签不换行的问题 */
  "htmlWhitespaceSensitivity": "ignore",
  /* 禁止对象最后一项末尾逗号 */
  "trailingComma": "none"
}
```

VSCode 打开设置的 `settings.json` 文件（Ctrl + Shift + P 搜索 settings，选择打开设置(json)）

添加以下配置，使编辑器在保存时自动根据eslint规则格式化

```js
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": false, // 关闭 vscode 的保存自动格式化功能
}
```

VSCode 也可以在 prettier 插件中添加以下全局配置

```sh
// 使用单引号包含字符串
"prettier.singleQuote": true,
// 不添加行尾分号
"prettier.semi": false,
// 禁止对象或者数组最后一项添加逗号
"trailingComma": "none"
```

VSCode 使 Prettier 插件使用当前项目的规则

![file save state](/images/vscode-setting-prettier.jpg)