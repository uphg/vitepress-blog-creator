---
title: babel、AST、依赖
date: 2022-06-12T21:48:00+08:00
tags:
  - Node.js
  - Webpack
  - babel
---

代码地址：[github.com/uphg/webpack-babel-compile-demo](https://github.com/uphg/webpack-babel-compile-demo)

## babel 的原理

1. parse: 把代码 code1 变成 AST
2. traverse: 遍历 AST 进行修改
3. generate: 把 AST 变成代码 code2

**运行流程**

code --(1)-> ast --(2)-> ast2 --(3)-> code2

## 将任意代码转为合法的 ES5 代码

使用 `@babel/core` 的 transformFromAstSync 方法即可，参考示例 `to-es5.ts`

## 分析 JS 的依赖关系

创建一个 collectCodeAndDeps 方法，用于分析 js 文件之间的依赖关系，参考 `deps_*.js`（静态分析）

## 总结

AST 

1. parse：把代码 code 变成 ast
2. traverse：遍历 AST 进行修改
3. generate：把 AST 变成代码 code2

工具

- babel 可以把新语法代码转为 ES5
- @babel/parser
- @babel/traverse
- @babel/generate
- @babel/core 包含前三者
- @babel/preset-env 内置转换规则

代码技巧

- 使用哈希表来存储数据
- 通过检测 key 来避免重复（循环依赖）

循环依赖

- 有的循环依赖可以正常执行（参考 project_5）
- 有的循环依赖不可以（参考 project_4）
- 但都可以做静态分析

