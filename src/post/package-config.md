---
title: package.json 配置项
date: 2021-12-04T22:11:20+08:00
tags:
  - Node.js
  - npm
  - package.json
---

## 配置示例

::: details 基础配置示例

```json
{
  "name": "vue",
  "version": "3.2.23",
  "description": "The progressive...",
  "main": "index.js",
  "module": "dist/vue.runtime.esm-bundler.js",
  "types": "dist/vue.d.ts",
  "unpkg": "dist/vue.global.js",
  "files": [
    "index.js",
    "index.mjs",
    "dist"
  ],
  "exports": {
    ".": {
      "import": {
        "node": "./index.mjs",
        "default": "./dist/demo.runtime.esm-bundler.js"
      },
      "require": "./index.js",
      "types": "./dist/demo.d.ts"
    },
    "./dist/*": "./dist/*",
    "./package.json": "./package.json",
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/npm/cli.git"
  },
  "keywords": [
    "npm"
  ],
  "author": "Jack",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/owner/project/issues"
  },
  "homepage": "https://github.com/owner/project#readme",
  "dependencies": {
    "vue": "3.2.23"
  }
}
```

:::

::: details Node.js 脚本包配置示例

```json
{
  "name": "vue",
  "version": "3.2.23",
  "description": "The progressive...",
  "bin": {
    "t": "cli.js"
  },
  "files": [
    "*.js"
  ],
  "version": "0.0.3",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/npm/cli.git"
  },
  "keywords": [
    "vue"
  ],
  "author": "Jack",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/owner/project/issues"
  },
  "homepage": "https://github.com/owner/project#readme",
  "dependencies": {
    "commander": "^3.0.2",
    "inquirer": "^8.0.0"
  }
}
```

:::

## name

包名称，如果要在 npm 上发布该包，不能与已发布的包名称冲突，同时它要满足以下规则

- 名称必须小于或等于 214 个字符
- 不能以点或下划线开头
- 包的名称中不得包含大写字母
- 该名称最终成为 URL 的一部分、命令行上的参数和文件夹名称。因此，名称不能包含任何非 URL 安全字符。

一些常用的命名技巧

- 不要使用与核心节点模块相同的名称。
- 不要在名称中加入“js”或“node”。假设它是 js，因为您正在编写 package.json 文件，并且您可以使用“engines”字段指定引擎。（见下文。）
- 名称可能会被库的使用者经常引用，因此它应该很短，但也应该具有合理的描述性。
- 命名前，在 npm 上查看是否已经存在该包名：[www.npmjs.com](https://www.npmjs.com/)

## version

**相关文档**

- 语义化版本控制规范：[semver.org](https://semver.org/)
- 版本控制语法文档：[npm/node-semver](https://github.com/npm/node-semver)

如果要在 npm 上发布该包，name 和 version 字段都是必须的。名称和版本构成一个包的唯一标识符，让它每次改动都是唯一的，所以每次发布包，都要更新版本。

版本号会附带标签，包括：latest（默认）、alpha（内测）、beta（公测）、next（下一个）等

默认排序大小为：`1.0.0` > `1.0.0-beta.0` > `1.0.0-alpha.0` 

版本号可以使用判断符，如：`<`、`<=`、`>`、`>=`、`=` 语法可以是单个条件，或者多个条件

```js
// 匹配小于 1.2.7的所有版本
<1.2.7

//匹配大于等于 1.2.7 并且小于 1.3.0 的版本
>=1.2.7 <1.3.0

// 还可以使用 || 语法
// 表示匹配 1.2.7 或大于等于 1.2.9 小于 2.0.0 的版本
1.2.7 || >=1.2.9 <2.0.0

// 与 1.2.7 等价，都表示等于 1.2.7
=1.2.7
v1.2.7
```

## description

包的描述，有助于别人在搜索时更容易搜到

## bin

包的可执行文件配置，通常用来配置包的可执行脚本，npm 会将它配置到 PATH 环境变量中

```json
// 默认用法
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": "./path/to/program"
}

// 与上面的配置效果相同
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": {
    "my-program": "./path/to/program"
  }
}
```

> 注意脚本文件开头必须添加 `#!/usr/bin/env node`

## main

包的入口文件路径（引用包的主文件），如果未设置，默认为根目录下的 index.js

## module

设置该包的 ESM 规范的入口文件（在包被引用时 `module` > `main`），主要用于配置兼容 ES6+ 语法的包，需要与 import 或 require 结合使用

配置示例

```json
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.umd.js"
    }
  }
}
```

所有允许引用 javascript 的模块语法都支持 ESM。
（仅与 import 或 require 结合使用）

## types

配置包的 TypeScript 类型声明文件路径，如下

```json
{
  "name": "awesome",
  "author": "Vandelay Industries",
  "version": "1.0.0",
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts"
}
```

## unpkg

unpkg 引用文件路径（通常为 umd 格式），详情参考：[unpkg.com](https://unpkg.com/)

## files

发布包时所包含的文件列表，通常为 dist 目录，默认为选择根目录下所有文件

可以设置 `.npmignore` 文件排除要包含在 npm 包内的文件，规则类似 `.gitignore`

无论设置如何，始终会包含某些文件：

- `package.json`
- `README`
- `LICENSE` / `LICENCE`
- `main` 字段中的文件

相反，以下文件总是被忽略：

- `.git`
- `CVS`
- `.svn`
- `.hg`
- `.lock-wscript`
- `.wafpickle-N`
- `.*.swp`
- `.DS_Store`
- `._*`
- `npm-debug.log`
- `.npmrc`
- `node_modules`
- `config.gypi`
- `*.orig`
- `package-lock.json`

## exports

指定包在被引用时使用哪个模块，该字段总是优先于其他字段，如：`main`、`module`、`browser` 或者自定义字段。

**基础用法**

配置示例

```js
{
  "name": "demo",
  "exports": {
    ".": "./main.js",
    "./sub/path": "./secondary.js",
    "./prefix/": "./directory/",
    "./other-prefix/*": "./yet-another/*/*.js"
  }
}
```

引用示例

```js
import demo from 'demo'	// .../package/main.js
import path from 'demo/sub/path'	// .../package/secondary.js
import foo from 'demo/other-prefix/foo'	// .../package/yet-another/foo.js
import deepBar from 'demo/other-prefix/deep/bar'	// .../package/yet-another/deep/bar.js
```

可以指定 `import` 或 `require` 引入方式的文件

**环境判断**

`exports` 可以根据环境配置要引用的文件

例如配置 import 引入包的入口文件时使用 `.es.js`，require 引用包的入口文件时使用 `.umd.js`

```js
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.umd.js"
    },
    "./package.json": "./package.json"
  }
}
```

## dependencies

项目所用的依赖，包括依赖的版本控制，它可以是包的 version，URL 链接，GitHub 地址或本地路径

```json
{
  "name": "foo",
  "version": "0.0.0",
  "dependencies": {
    "foo" : "2.0.1",
    "bar" : "http://asdf.com/asdf.tar.gz",
    "express": "expressjs/express", // git@github.com:expressjs/express.git
    "two" : "file:../two"
  }
}
```

本地路径支持以下格式

```json
.. /foo/bar
~/foo/bar
./foo/bar
/foo/bar
```

## devDependencies

配置开发环境的依赖包，主要在开发模式下使用，通常用来存放编译工具等

## peerDependencies

对等依赖，配置当前包所需的依赖包及版本信息，配置后包的使用者引入包时会自动根据 peerDependencies 检测相关依赖是否存在并且满足版本要求，也用来防止包的使用者多次安装相同的库。

假如 A、B 库同时使用了 依赖 pluginA 和 pluginB，默认配置情况下，`node_modules` 如下图所示

```
.
└─ node_modules
│  ├─ A
│  │  ├─ pluginA
│  │  └─ pluginB
│  └─ B
│     ├─ pluginA
│     └─ pluginB
...
```

但是如果 A、B 库配置了 peerDependencies

```json
// A package.json
{
  "peerDependencies": {
    "pluginA": "1.0.0",
    "pluginB": "1.0.0"
  }
}

// B package.json
{
  "peerDependencies": {
    "pluginA": "1.0.0",
    "pluginB": "1.0.0"
  }
}
```

那么安装时，它们的 `node_modules` 结构就会像这样

```
.
└─ node_modules
│  ├─ A
│  ├─ B
│  ├─ pluginA # v1.0.0
│  └─ pluginB # v1.0.0
...
```

> 如果你没有安装 peerDependencies 中指定版本的依赖，npm 不会自动安装同等依赖，只会产生警告，需要你去手动安装。

## bundledDependencies

捆绑依赖，当前包被打包时捆绑依赖中指定的项会被一同打包，捆绑依赖中声明的包必须要在 devDependencies 或 dependencies 中存在，因为捆绑依赖的版本信息要根据 devDependencies 或 dependencies 获取，它本身以数组形式声明

```json
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundledDependencies": [
    "renderized",
    "super-streams"
  ]
}
```

> 该选项允许两种命名方式：`bundledDependencies`、`bundleDependencies`

## optionalDependencies

可选依赖项，一些依赖包即使安装失败，仍然可以运行的依赖项（可以理解为当前包对该依赖非必要）

## repository

指定代码存放的地址，通常用来配置代码 GitHub 仓库地址

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/demo/lib-demo.git"
  }
}
```

## keywords

配置包的搜索关键字，有助于 npm 搜索包时根据关键字查找包

## author

包作者的名字

## license

包使用的开源协议，如 MIT 协议

```json
{
  "license": "MIT",
}
```

## bugs

bug 反馈地址，通常为仓库的 issues 地址

```json
{
  "bugs": {
    "url": "https://github.com/owner/project/issues"
  }
}
```

## homepage

项目的主页，通常是该库的文档地址或者仓库首页

```json
{
  "homepage": "https://github.com/owner/project#readme",
}
```

## 参考文章

- [npm | package.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)
- [package.json 中 你还不清楚的 browser，module，main 字段优先级](https://github.com/SunshowerC/blog/issues/8)
- [Documentation - Publishing - TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)