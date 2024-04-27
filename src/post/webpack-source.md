---
title: Webpack 源码阅读
date: 2022-06-16T14:53:49+08:00
---

## 准备代码

- 创建一个 demo 项目
- webpack-cli 将 src/index.js 打包为 dist/main.js
- 从 GitHub 下载 webpack，切换至 v5.10.1（`git reset --hard v5.10.1`）
- 从 GitHub 下载 webpack-cli，切换至 v4.2.0（`git reset --hard webpack-cli@4.2.0`）

## 调试

- webpack-cli 默认会执行 node_modules 里的 JS 代码变为
- 我们可以篡改 node_modules 源码
- 也可以用 npm Link 替换 node_modules 里的目录

创建本地包连接

- 在 webpack 项目根目录运行 npm link
- 在 webpack-cli 项目下的 packages/webpack-cli 目录中运行 npm link
- 在 demo 项目根目录运行 npm link webpack webpack-cli


## webpack 源码路线图

Webpack Cli

webpack cli 如何运行 webpack

```js
- runCLI()
- cli.run(...)
- this.createCompiler(options, callback)
- webpack(options, callback)
```

webpack

webpack 如何编译 `src/index.js`

```js
- lazyFunction(() => require("./webpack"))
- webpack()
- createCompiler(options);
- new Compiler(options.context);
```

## webpack cli 调用 wepack 代码


调用流程

```
runCLI -> cli.run -> createCompiler -> webpack
```

代码流程

- bin/cli.js
  ```js
  const [, , ...rawArgs] = process.argv;

  if (packageExists('webpack')) {
    runCLI(rawArgs);
  } else {
    ...
  }
  ```
- lib/bootstrap.js
  ```js
  const runCLI = async (cliArgs) => {
    try {
      const cli = new WebpackCLI();
      ...
      await cli.run(...);
    } catch {
      ...
    }
  }
  ```
- lib/webpack-cli.js
  ```js
  const webpack = packageExists('webpack') ? require('webpack') : undefined;
  ...
  class WebpackCLI {
    ...
    createCompiler(options, callback) {
      let compiler;
      try {
        // 关键代码，在此处调用了 webpack
        compiler = webpack(options, callback);
      } catch (error) {
        ...
      }
    }
    ...
    async run(args) {
      let compiler
      ...
      compiler = this.createCompiler(options, callback);
    }
  }
  ```

## webpack 是如何分析 index.js 的代码

代码流程

- lib/index.js
  ```js
  ...
  const fn = lazyFunction(() => require("./webpack"));
  module.exports = mergeExports(fn, {...});
  ```
- lib/webpack.js
  ```js
  const createCompiler = () => {
    ...
    const compiler = new Compiler(options.context);
    ...
  }
  ...
  const webpack = ((options, callback) => {
    const create = () => {
      if (Array.isArray(options)) {
        ...
      } else {
        /** @type {Compiler} */
        compiler = createCompiler(options);
        ...
        // 重点搞清楚 compiler.hooks.xxx 是什么
        compiler.hooks.environment.call();
        compiler.hooks.xxx.call();
      }
    }
    if (callback) {
      try {
        const { ... } = create()
      } catch (error) {
        ...
      }
    } else {
      ...
    }
  })
  ```
- lib/Compiler.js
  ```js
  const { SyncHook, ... } = require("tapable");

  class Compiler {
    constructor(context) {
      this.hooks = Object.freeze({
        initialize: new SyncHook([]),
        ...
      })
    }
    ...
  }
  ```


## hooks.xxx.call 是什么

**tapable**

- webpack 团队为了写 webpack 而是实现的一个事件库
- 一个发布订阅系统

**用法**

- 定义一个事件/钩子
  `this.hooks.eventName = new SyncHook([arg1, arg2])`
- 监听一个事件/钩子
  `this.hooks.eventName.tap('监听的理由', fn)`
- 触发一个事件/钩子
  `this.hooks.eventName.call(arg1, arg2)`


## webpack 事件流程

流程笔记（*代表事件）

```
createCompiler()
* environment
* afterEnvironment
* initialize
compiler.run()
* beforeRun
* run
this.readRecords()
this.compile(onCompiled)
* beforeCompile
* compile
this.newCompilation(?) # 初始化编译
* make
* finishMake
nextTick
compilation.finish(?)
* finishModules
compilation.seal(?)
chunkGraph = new ChunkGraph(this.moduleGraph);
* seal
this.addChunk()
buildChunkGraph();
* afterChunks
* optimize            # 优化
* optimizeModules
* afterOptimizeModules
* optimizeChunks
* afterOptimizeChunks
* optimizeTree
* optimizeXXX...
* beforeCodeGeneration # 2051 行
this.codeGeneration()
this.createChunkAssets()
* processAssets
* afterSeal

* afterCompile
onCompiled
* shouldEmit
nextTick
this.emitAssets
this.emitRecords
* done
```

Webpack 把打包分为了这几个阶段

```
env                 # environment
init                # initialize
run                 # compiler.run()
beforeCompile
compile
compilation
make
finishMake
afterCompile
emit
```

Webpack 的架构就是一个事件模型，把所有事件流程安排好，想要执行对应事件，只需要监听对应的事件名

## Webpack 是如何处理 Entry 的

**读取 index.js 并分析和收集依赖是在哪个阶段？**

- 用排除法可以知道，肯定不是 env 和 emit，肯定在 beforeCompile 和 afterCompile 之间
- 最有可能是在 make - finishMake 阶段（为什么？）
- 学过 C 语言就会知道，make 是编译时必然会用到的工具

**make - finishMake 之间，做了什么？**

- 搜索 make.tap，发现很多地方监听了 make 事件
- 凭借我们的直觉，我们直接打开 EntryPlugin
- EntryPlugin 的 addEntry 函数就是 make 阶段最重要的事情之一

make 做了什么

```js
make.tapAsync("EntryPlugin", ...)
EntryPlugin.createDependency(entry, options)  // 此处 entry 默认就是 './src' 路径
compilation.addEntry()
this._addEntryItem()
* addEntry
this.addModuleChain()
this.handleModuleCreation()
this.factorizeModule()
this.factorizeQueue.add()
this._factorizeModule()
factory.create()
```

关于 this.factorizeQueue

```js
// 任务队列
this.factorizeQueue = new AsyncQueue({
  name: "factorize",
  parallelism: options.parallelism || 100,
  processor: this._factorizeModule.bind(this)  // 处理者，表明由 this._factorizeModule 来处理 this.factorizeQueue 添加的任务
});
```

## factory.create 是什么？

- factory 是哪里来的？
- 从 factorizeModule(options 的 options.factory 来的
this.hooks.factorize.tapAsync()
- options.factory 是哪里来的？

- 是从 moduleFactory 来的。
- moduleFactory 哪里来的？
- 是用 `this.dependencyFactories.get(Dep)` 得到的。
- `this.dependencyFactories.get(Dep)` 是个啥？
- 搜 compilation.tap 就知道，它是 normalModuleFactory，简称 nmf


结论：factory 就是 nmf，所以 factory.create 就是 nmf.craete

## NormalModuleFactory.create 做了什么

代码流程

```js
create()
* beforeResolve // 找到入口文件位置（如根据 ./src 找到 ./src/index.js）
* factorize
this.hooks.factorize.tapAsync()
* resolve
* afterResolve
* createModule // 生成 module 对象
```

- scheme 协议，代指 HTTP 协议


由此我们知道 factory.create 创建了一个 module 对象（表示路径对应文件的内容）

继续回到 this.factorizeModule()

```js
this.factorizeModule()
this.addModule()
this.buildModule()
```

## addModule 做了什么？

- 把 module 添加到 compilation.modules 里
- 通过检查 id 防止重复添加

## buildModule 做了什么？

- 调用了 `module.build()`
- 到 NormalModule.js 看 build 源码，发现了 runLoaders
- 然后来到 processResult()，发现了 `_source = ...` 和 `_ast = null`
- 这么做显然是要把 _source 变成 _ast 了！
- 来到 doBuild 的回调，发现了 `this.parser.parse()`
- parse 就是把 code 变成 ast
- parser 来自于 acorn 库，webpack 引用了一个第三方库来处理 JS 文件


代码流程

```js
buildModule()
this.buildQueue.add()
_buildModule()
module.needBuild()
module.build()         // 来自 NormalModule.js 的 build 方法
NormalModule.build()
NormalModule.doBuild()
runLoaders()
processResult()        // 此处 _source = result[0] 和 _ast = null 
this.createSource()    // 读取文件源代码
```


NormalModule.build 方法

```js
build(options, compilation, resolver, fs, callback) {
  this._source = null;
  this._ast = null;
}
```

> needbuild 表示是否需要 build


## 总结

- webpack 使用 tapable 作为事件中心
- 将代码分为了 env、compile、make、seal、emit 几个阶段
- 在 make 阶段借助 acorn 库对源码进行 parse（解析）得到 ast
- 处理 ast 中的 import 语句，打包代码

