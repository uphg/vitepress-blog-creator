---
title: Vue 造轮子 - 创建 Vue 3 项目
date: 2021-08-07T12:02:45+08:00

tags: 
  - Vue
---

总结创建 Vue 3 项目的踩坑。

## 搭建项目

运行以下命令创建一个包含 ts 的 Vue 3 项目，参考自：[cn.vitejs.dev/guide/](https://cn.vitejs.dev/guide/)

```sh
yarn create vite vue3-vite-example --template vue-ts
```

进入文件夹运行项目

```sh
cd vue3-vite-example
yarn
yarn dev
```

## 添加 Vue Router 4

安装

```sh
yarn add vue-router@4.0.10
```

创建一个 `router.ts` 文件，添加以下内容

```ts
// router.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import Hi from '../components/Hi.vue'

// 此处是 Hash 模式路由，要使用 History 路由，请引入 createWebHistory 创建
const history = createWebHashHistory()

export const router = createRouter({
  history,
  routes: [
    {
      path: '/',
      component: HelloWorld
    },
    {
      path: '/hi',
      component: Hi
    }
  ]
})
```

在 `main.ts` 中引入该文件

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

## 配置 404 路由

详情参考：[捕获所有路由或 404 Not found 路由](https://next.router.vuejs.org/zh/guide/essentials/dynamic-matching.html#捕获所有路由或-404-not-found-路由)

```ts
routes: [
  {
    path: '/home',
    component: HelloWorld
  },
  {
    path: '/hi',
    component: Hi
  },
  ...
  /* 404 路由放在最后 */
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]
```

## vue-tsc 踩坑

如果你在使用 Vite 打包时提示一个类似这样的报错

```sh
node_modules/xxx/xxx/xxx.d.ts:5:28 - error TS2307: Cannot find module 'src' or its corresponding type declarations
```

多半是 `vue-tsc` 没有跳过 `node_modules` 包的检查，可以添加 `--skipLibCheck` 命令跳过，如下

```json
// package.json
{
  "script": {
    "build": "vue-tsc --noEmit --skipLibCheck && vite build"
  }
}
```

想要知道 `vue-tsc` 有哪些参数，可以运行如下命令

```sh
$ ./node_modules/.bin/vue-tsc --help
```


相关错误参考：https://github.com/johnsoncodehk/vue-tsc/issues/62

## 参考文章

- [dev.to/vuesomedev/add-testing-to-vite-4b75](https://dev.to/vuesomedev/add-testing-to-vite-4b75)
- [https://www.xiaoboy.com/topic/202108302255.html](https://www.xiaoboy.com/topic/202108302255.html)
- [https://github.com/johnsoncodehk/vue-tsc/issues/62](https://github.com/johnsoncodehk/vue-tsc/issues/62)
