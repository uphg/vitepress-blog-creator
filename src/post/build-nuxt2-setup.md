---
title: 在 Nuxt2 中使用 script setup + TS
date: 2022-01-31T23:06:40+08:00
---

使用 Nuxt.js 搭建 Vue2 + script setup + TypeScript 的项目

示例项目：[nuxt2-setup-demo](https://github.com/uphg/nuxt2-setup-demo)

## 使用 script setup

创建 Nuxt.js 项目

```sh
yarn create nuxt-app <project-name>
```

安装 composition api

```sh
yarn add @nuxtjs/composition-api
```

添加 nuxt 配置

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
  ],
  scriptSetup: { /* options */ },
}
```

写一个 HelloWorld 组件测试

```vue
<!-- HelloWorld.vue -->
<template>
  <div>
    <h2>Hello World AAA</h2>
    <p>{{ counts }}</p>
    <el-button @click="counts += 1">
      点击+1
    </el-button>
  </div>
</template>

<script setup>
import { ref } from '@nuxtjs/composition-api'
// your script setup
const counts = ref(0)
</script>
```

## 添加 TypeScript 类型支持

安装 [`@nuxtjs/typescript-module`](https://typescript.nuxtjs.org/) 模块

```sh
yarn add -D @nuxt/typescript-build vue-tsc
```

添加 TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "types": [
      ...
      "unplugin-vue2-script-setup/types"
    ],
    "noUnusedLocals": true
  },
  "vueCompilerOptions": {
    "target": 2
  },
}
```

追加 nuxt 配置

```js
// nuxt.config.js
export default {
  buildModules: [
    ['@nuxt/typescript-build', { typeCheck: false }],
    '@nuxtjs/composition-api/module',
    'unplugin-vue2-script-setup/nuxt',
  ],
}
```

添加运行脚本

```json
// package.json
{
  "scripts": {
    "dev": "nuxt",
    "build": "vue-tsc --noEmit --skipLibCheck && nuxt build",
    "generate": "vue-tsc --noEmit --skipLibCheck && nuxt generate"
  }
}
```

> `--skipLibCheck` 表示不对项目依赖的类型做检测

## 报错问题

如果 TypeScript 提示 `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements'` 报错，添加以下配置，表示不使用严格的类型检查，或者使用全局的 `defineProps`、`defineEmits` 等函数报错，可以添加 `@vue/runtime-dom` 依赖解决

```sh
pnpm add -D @vue/runtime-dom
```

如果 TypeScript 提示 `Cannot use JSX unless the '--jsx' flag is provided` 错误，在 `tsconfig.json` 中添加以下配置

```json
{
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```