---
title: Vue 造轮子 - 添加单元测试
---

给 Vue3 项目添加单元测试

## Jest 单元测试

本次使用 Vue 官方测试库 [Vue Test Utils](https://vue-test-utils.vuejs.org/) 首先安装测试相关的依赖

```sh
yarn add jest@26.6.3 @types/jest ts-jest@26.5.6 vue-jest@next @vue/test-utils@next --dev
```

> 由于 Jest 的版本变动，安装依赖后可能会提示的报错，所以一定要按照上面的版本安装。很多包都使用了 next 版本（下一个版本），因为只有 next 版本才支持 Vue 3。

默认情况下，Jest 是无法解析 Vue 和 TypeScript 文件的。所以我们要添加配置 `jest.config.js` 文件，让它支持转义 `.ts` 和 `.vue` 文件：

```js
// jest.config.js
module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest'
  }
}
```

然后将 Jest 的类型定义添加到 TS 配置文件中

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "types": ["vite/client", "@types/jest"],
    ...
  },
  ...
}
```

在 `package.json` 中添加运行脚本

```json
// package.json
{
  ...
  "scripts": {
    ...
    "test": "jest src"
  },
  ...
}
```

最后，在 `HelloWorld.vue` 旁边添加个单元测试文件

```ts
// src/components/HelloWorld.spec.ts
import { mount } from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld', () => {
  it('should display header text', () => {
    const msg = 'Hello Vue 3'
    const wrapper = mount(HelloWorld, { props: { msg } })

    expect(wrapper.find('h1').text()).toEqual(msg)
  })
})
```

运行测试，完成

```sh
yarn test
```

我的 `package.json` 完整配置

```json
{
  "name": "vue3-test-example",
  "version": "0.0.1",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit --skipLibCheck && vite build",
    "serve": "vite preview",
    "test": "jest test --watch"
  },
  "dependencies": {
    "vue": "^3.2.6",
    "vue-router": "4.0.10"
  },
  "devDependencies": {
    "@types/jest": "^27.0.1",
    "@types/node": "^16.7.6",
    "@vitejs/plugin-vue": "^1.6.1",
    "@vue/compiler-sfc": "^3.2.6",
    "@vue/test-utils": "^2.0.0-rc.14",
    "jest": "26.6.3",
    "stylus": "^0.55.0",
    "ts-jest": "26.5.6",
    "typescript": "^4.3.2",
    "vite": "^2.5.4",
    "vue-jest": "^5.0.0-alpha.10",
    "vue-tsc": "^0.2.2"
  }
}
```

GitHub 示例项目：[https://github.com/uphg/vue3-ts-vite-jest-example](https://github.com/uphg/vue3-ts-vite-jest-example)

### 依赖说明

- `jest`：JavaScript 测试框架。
- `@types/jest`：Jest 类型提示。
- `ts-jest`：让 Jest 支持 TS 文件。
- `vue-jest@next`：让 Jest 支持加载 Vue 单文件组件（`.vue` 文件）。 
- `@vue/test-utils@next`：Vue.js 官方的单元测试实用工具库。


## 让 Jest 支持 TSX

安装依赖

```sh
yarn add -D babel-jest@26.6.3 @babel/core @babel/preset-env @babel/preset-typescript @babel/preset-react jest-css-modules-transform
```

创建 `babel.config.js` 文件，添加以下配置

```js
module.exports = {
  presets:
    process.env.NODE_ENV === 'test'
      ? [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          [
            '@babel/preset-typescript',
            {
              allExtensions: true,
              isTSX: true,
              jsxPragma: 'h',
              jsxPragmaFrag: 'Fragment'
            }
          ],
          [
            '@babel/preset-react',
            {
              pragma: 'h',
              pragmaFrag: 'Fragment'
            }
          ]
        ]
      : [
          [
            '@babel/preset-env',
            {
              targets: '>2%, not IE 11'
            }
          ]
        ]
}
```

在 `jest.config.js` 中添加以下配置

```js
module.exports = {
  moduleDirectories: ['node_modules'],
  testMatch: [
    '<rootDir>/test/**/*.(spec|test).(ts|tsx)'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
    'vue'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
    // ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    ".+\\.(css|styl)$": "jest-css-modules-transform",
    '^.+\\.(j|t)sx?$': 'babel-jest'
  },
}
```

### 依赖说明

- `babel-jest@26.6.3`：让 Jest 支持 babel
- `@babel/core`：babel 核心
- `@babel/preset-env`：转换 ES6 模块化规则
- `@babel/preset-typescript`：支持 TS
- `@babel/preset-react`：转换 JSX 语法
- `jest-css-modules-transform`：让 Jest 支持转换 `css|styl|less|sass|scss` 样式文件