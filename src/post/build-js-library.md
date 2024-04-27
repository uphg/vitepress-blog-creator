---
title: 搭建 JavaScript 库
date: 2022-01-20T13:52:58+08:00
tags:
  - JavaScript
  - Chai
  - Mocha
  - Jest
---

记录搭建一个 JavaScript 库的过程

示例项目：[github.com/uphg/vanilla-ts-lib-starter](https://github.com/uphg/vanilla-ts-lib-starter)

## 使用 Vite 搭建脚手架

运行 create 命令快速创建

```sh
pnpm create vite my-vanilla-app
# 或指定模板
pnpm create vite my-vanilla-app --template vanilla-ts
```

添加 library（库）配置

```ts
// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'demo-lib',
      formats: ['es', 'umd'], // default：['es', 'umd']
      fileName: (format) => `index.${format}.js`
    }
  }
})
```

在 src 中创建一个 index.ts 测试

```js
function add(a: number, b: number) {
  return a + b
}

function reduce(a: number, b: number) {
  return a - b
}

export { add, reduce };
```

运行 `pnpm build` 打包该文件

## 添加 TS 类型编译插件

安装插件

```sh
# 用于编译 TS 类型声明文件
pnpm add -D rollup rollup-plugin-typescript2
```

添加 rollup 配置

```js
// rollup.config.js
import path from 'path'
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      // preserveModules: false,
      dir: 'types',
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: false,
          declaration: true,
          declarationMap: false,
          rootDir: './src',
          outDir: 'types',
          declarationDir: 'types'
        }
      }
    })
  ]
}
```

添加运行脚本

```json
{
  "scripts": {
    "build:types": "rollup -c"
  }
}
```

## chai + mocha + sinon 单元测试

### chai + mocha

- chai：一个封装的测试用例库
- mocha：用来提供 describe、it 函数，以及更漂亮的测试输出的一个库

**安装**

```sh
# 全局安装 TS Node 环境
pnpm global add ts-node mocha

# 安装单元测试相关插件
pnpm add -D chai mocha
pnpm add -D @types/node @types/chai @types/mocha

# 运行以下命令让 mocha 支持测试 TS 文件（测试 test/index.ts 文件）
mocha -r ts-node/register test/index.ts

# 在当前项目中安装 TS Node 环境
pnpm add -D ts-node typescript
```

配置当前项目中运行 TS 测试的脚本

```json
{
  "scripts": {
    "test": "mocha -r ts-node/register test/**/*.ts"
  }
}
```

**使用**

```js
import * as chai from 'chai'

const assert = chai.assert

describe('a', () => {
  it('a 是 true', () => {
    const a = true
    assert.isTrue(a)
  })
})
```

### sinon

sinon 是一个专门用来测试函数的库，它可以与 chai 结合使用

**安装**

```sh
pnpm add -D sinon sinon-chai
pnpm add -D @types/sinon @types/sinon-chai
```

**与 chai 结合使用**

```ts
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)
const assert = chai.assert

describe('fn', () => {
  it('fn 被调用', () => {
    const fn = sinon.fake()
    fn()
    assert.isTrue(fn.called)
  })
})
```

## Jest 单元测试

Jest 最大的优点就是方便，它整合了很多测试工具，是一个集成的测试框架

### 配置运行环境

安装依赖

```sh
# 安装 Jest
pnpm add -D jest @types/jest

# 安装 Babel 支持
pnpm add -D babel-jest @babel/core @babel/preset-env

# 安装 TypeScript 支持（需要配置 babel）
pnpm add -D ts-node @babel/preset-typescript
```

添加 babel 配置，参考自：[使用-babel](https://jestjs.io/zh-Hans/docs/getting-started#使用-babel)

```js
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
}
```

添加 Jest 配置（运行 `jest --init` 初始化配置文件）

```ts
// jest.config.ts
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // 匹配测试文件
  testMatch: [
    "**/test/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  // 配置测试跳过路径
  testPathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],
  verbose: true,
};

export default config
```

在 `package.json` 中添加运行脚本

```json
{
  "scripts": {
    ...
    "test": "jest"
  }
}
```

### 创建测试用例

添加示例方法

```js
// ./src/add.ts
function add(a: number, b: number) {
  return a + b
}

export default add
```

给该方法添加测试文件

```js
// ./test/add.test.ts
import add from '../src/add'

test('add', () => {
  expect(add(1, 2)).toBe(3)
})

```

运行 `pnpm test` 测试该方法
