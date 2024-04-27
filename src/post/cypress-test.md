---
title: Cypress 自动化测试
date: 2022-03-21T20:33:07+08:00
tags:
  - Node.js
  - Cypress
---

## 自动化测试的好处

用代码来模拟键盘、鼠标操作，方便多个页面，多次重复测试。

## 为什么以前自动化测试不流行

- 以前浏览器对自动化的支持不友好，如 IE
- 自动化测试框架 API 不友好，有很大的学习成本，如 selenium

## 为什么现在可以做自动化测试

- 支持 Headless（无界面）的浏览器变多，方便测试
- 一些自动化测试框架的 API（Cypress）非常友好
- Cypress 自带丰富的测试样例

## Cypress 简介

### 版本

- v1.0.0 - 2017 年 10 月，基于 Electron（Chromium + Node.js），多平台支持，但不支持 IE
- v2.0.0 - 2018 年 2 月，升级至 Chromium 59
- v3.0.0 - 2018 年 5 月，支持 Node 任务，可以用来连接数据库、读文件等
- v4.0.0 - 2020 年 2 月，支持 Firefox 和基于 Chromium 的 Edge 浏览器

### Cypress 优点

- 界面美观友好
- 支持模拟手机
- 每一步操作截图
- 全程录屏
- 支持 debug，随时暂停
- 自动等待 UI 更新，减少异步代码（减少 await 写法）

## 安装

**用命令行安装**

```sh
yarn add -D cypress
# or npm i -D cypress
```

如果未翻墙，需要将 `*.cypress.io` 添加到代理规则列表

**用本地压缩包 + 命令行安装**

如果没办法翻墙，可以先[下载 cypress.zip](https://docs.cypress.io/guides/getting-started/installing-cypress#Direct-download) 压缩包，然后在安装命令前添加 `CYPRESS_INSTALL_BINARY=/绝对路径/cypress.zip`，示例

```sh
CYPRESS_INSTALL_BINARY=/d/Jack/Downloads/cypress.zip npm install -D cypress
```

## 运行 Cypress

**启动**

- 用 VSCode 或者命令行打开安装 cypress 的目录
- 输入 `./node_modules/.bin/cypress open`
- 然后你就会看到 Cypress 的界面
- 可能会提示你是否要安装示例文件
- 同时 Cypress 会创建 cypress.json 文件

**启动单个测试用例**

```sh
./node_modules/.bin/cypress run --spec cypress/integration/1-getting-started/todo.spec.js

# 使用 --headed 参数查看测试用例运行过程
```

**不运行 examples 目录**

在 cypress.json 里面添加如下配置

```json
{
  "ignoreTestFiles": [
    "*.hot-update.js", "**/examples/*.*"
  ]
}
```

创建一个测试 demo

```js
describe('百度', () => {
  it('可以搜索 MDN', () => {
    cy.visit('https://www.baidu.com/')
    cy.get('input#kw').type('MDN') // 搜索框输入MDN
    cy.get('input#su').click() // 点击百度一下
    cy.contains('MDN').should('exist')
    cy.contains('developer.mozilla.org').should('exist')
  })
})
```

运行 `./node_modules/.bin/cypress run`