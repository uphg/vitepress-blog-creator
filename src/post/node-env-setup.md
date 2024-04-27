---
title: Node.js 环境搭建
date: 2021-12-04T21:56:55+08:00
tags:
  - Node.js
  - npm
  - pnpm
  - yarn
---

## 安装 Node.js

进入[官网](https://nodejs.org/zh-cn/)，下载稳定版安装，安装过程中如果有需要勾选的选项，尽量选择勾选。

安装 Node.js 后重启命令行（不要打开 Node.js），Node.js 默认自带了 npm、npx 工具，如下

```sh
node --version
npm --version
npx --version
```

## npm CLI

Node 包管理工具

### 基础用法

| 命令            | 说明                           |
| --------------- | ------------------------------ |
| `npm install`   | 初始化当前目录下所有包         |
| `npm i <pkg>`   | 安装指定包                     |
| `npm run <cmd>` | 运行 package.json 中的指定命令 |

### npm init

在当前目录中初始化 `package.json` 配置

```sh
npm init
npm int -y # 使用默认配置初始化项目
```

### npm install

基础用法

```sh
npm install # 初始化当前根目录下的 package 中的包
npm install <name>@<version> # 安装指定版本的包
npm install <alias>@npm:<name>
```

别名

```sh
npm i <name>
npm add <name>
```

常用选项

- `-P | --save-prod`：保存在 `dependencies`（生产环境依赖），`npm i` 的默认值，除非 `-D` 或 `-O` 存在。
- `-D |--save-dev`：保存在 `devDependencies`（开发环境依赖）
- `-E, --save-exact`：保存的依赖项将被配置为一个确切的版本，而不是使用 npm 的默认 semver 范围操作符（`^`）。
- `-O | --save-optional`：保存在 `optionalDependencies`（可选依赖）
- `--no-save`：防止保存到 dependencies
- `-B, --save-bundle`：保存依赖项并且将它将添加到 `bundleDependencies` 列表中。

### npm list

查看 npm 全局安装的包

```sh
npm list -g --depth=0
```

### npm uninstall

卸载包，基础用法

```sh
npm uninstall sax # 卸载包，并删除相关 package.json 配置
npm uninstall lodash --no-save # 不会删除 package.json 中的配置
```

### 查看全局包安装位置

```js
npm root -g
```

### npm link

将当前目录的包链接到全局，其他项目可以通过 `npm link <name>@<version>` 安装，主要用于测试未发布的包

```sh
# 发布一个包
npm link
# 取消发布的包
npm unlink

# 链接本地发布的包（相当于安装本地发布的包）
npm link <name>@<version>
# 卸载指定本地包
npm unlink <name>@<version>
```

> `npm link` 的别名 `npm ln`

### npm publish

发布一个包，默认情况下将发布 npm 官方注册表

```sh
npm publish [<folder>] [--tag <tag>]
```

常用选项

- `<folder>`：package.json 文件所在的文件夹，默认为当前根目录
- `--tag <tag>`：发布时指定包的版本，默认 npm 会根据 package.json 发布

### npm adduser

登录你的 npm 账号，登录后会将账号存储到本地的 `.npmrc` 中

### 向 npm 提交脚本包

修改 package.json 的 name、bin、files，示例

```json
{
  "name": "toup",
  "bin": {
    "t": "cli.js"
  },
  "files": [
    "*.js"
  ],
  "version": "0.0.3",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "commander": "^3.0.2",
    "inquirer": "^8.0.0"
  }
}
```

运行 `npm adduser`，登录你的账号 -> 运行 `npm publish` 发布包。

### 配置 npm 下载源

查看当前源

```sh
npm config get registry
# https://registry.npmjs.org/
```

设置一个源（设置成功后不会有任何提示输出）

```sh
npm config set registry https://registry.npm.taobao.org/
```

安装包时使用指定源

```sh
# 初始化所有包
npm install --registry=https://registry.npm.taobao.org

# 安装指定包
npm install vue --registry=https://registry.npm.taobao.org
```

### nrm 源管理器

[nrm](https://github.com/Pana/nrm) 是一个 npm 下载源的管理工具，可以便捷的切换源地址。

全局安装

```sh
npm install -g nrm
```

查看当前源

```sh
nrm ls
```

切换指定源

```sh
nrm use taobao
```

> 此处推荐切换至淘宝源

添加源

```sh
nrm add <registry> <url> [home]
# 示例：nrm add xxx https://xxx.xxx.com/
```

添加源的参数

- registry（必选）：源名称
- url（必选）：源地址
- home（可选）：源的主页

删除源

```sh
nrm del <registry>
# 示例：nrm del xxx
```

测试源速度

```sh
# 测试指定源速度
nrm test npm
* npm ---- 833ms

# 测试所有源速度
nrm test
* npm ---- 807ms
  cnpm --- 374ms
  taobao - 209ms
  nj ----- Fetch Error
  rednpm - Fetch Error
  npmMirror  1056ms
  edunpm - Fetch Error
```

访问源主页

```sh
nrm home <registry>
```

## pnpm

[pnpm](https://pnpm.io/zh/cli/install) 与其他包管理器最大的区别就是**节约磁盘空间并提升安装速度**

1. 如果你用到了某依赖项的不同版本，那么只会将有差异的文件添加到仓库。 例如，如果某个包有100个文件，而它的新版本只改变了其中1个文件。那么 pnpm update 时只会向存储中心额外添加1个新文件，而不会因为仅仅一个文件的改变复制整新版本包的内容。
2. 所有文件都会存储在硬盘上的某一位置。 当软件包被被安装时，包里的文件会硬链接到这一位置，而不会占用额外的磁盘空间。 这允许你跨项目地共享同一版本的依赖。

### 与 npm 的区别

| npm 命令        | pnpm 等效        |
| --------------- | ---------------- |
| `npm install`   | `pnpm install`   |
| `npm i <pkg>`   | `pnpm add <pkg>` |
| `npm run <cmd>` | `pnpm <cmd>`     |

### pnpm add

| 命令                 | 含义                          |
| ----------------------- | ----------------------------- |
| `pnpm add <pkg>`     | 保存到 `dependencies`         |
| `pnpm add <pkg> [--save-dev/-D]` | 保存到 `devDependencies`      |
| `pnpm add <pkg> [--save-optional/-O] ` | 保存到 `optionalDependencies` |
| `pnpm add <pkg> [--global/-g]` | 安装全局包                    |

### pnpm remove

基本用法

```sh
# 删除一个包
pnpm remove sax

# 删除开发环境的包
pnpm remove -D sax

# 删除全局安装的包
pnpm remove sax --global
```

### pnpm exec

运行当前项目的 jest 命令

```sh
pnpm exec jest
# 还可以简化为
pnpm jest
```

### pnpm list

查看当前项目依赖

```sh
pnpm list
pnpm list -D # 仅显示开发环境的依赖（devDependencies） 
pnpm list -P # 仅显示生产环境的依赖（dependencies/optionalDependencies）
```

查看全局依赖

```sh
pnpm list --global
```

### pnpm 

### pnpm create

使用 create-* 启用套件来创建一个项目

```sh
pnpm create react-app my-app
pnpm create vite my-vue-app
```

## yarn

Yarn 也是一个包管理器，它与 npm 比最大的优势就是可以并行安装多个包（虽然 npm 现在也优化了这点）

### 安装

打开[官网](https://classic.yarnpkg.com/en/docs/install/#windows-stable)，点击如下内容下载

![安装 yarn 步骤图示](/images/node-env-yarn-install.jpg)

### yarn add

参考它与 npm 命令的对照表

| npm 命令                           | yarn 等效                        |
| ---------------------------------- | -------------------------------- |
| `npm i <pkg>`                      | `yarn add <pkg>`                 |
| `npm i <pkg>@<version>`            | `yarn add <pkg>@<version>`       |
| `npm i <pkg> [--save-dev/-D]`     | `yarn add <pkg> [--dev/-D]`      |
| `npm i <pkg> [--save-exact/-E]`    | `yarn add <pkg> [--exact/-E]`    |
| `npm i <pkg> [--save-optional/-O]` | `yarn add <pkg> [--optional/-O]` |

### yarn remove

删除一个包

```sh
yarn remove <pkg>
```

### yarn global

对全局安装的包做一些操作

```sh
yarn global <add/bin/list/remove/upgrade> [--prefix]
```

### yarn link

将当前目录的包链接到全局，其他项目可以通过 `yarn link <name>@<version>` 安装，主要用于测试未发布的包

```sh
yarn link # 发布
yarn unlink # 取消发布


yarn link <pkg> # 安装
yarn unlink <pkg> # 卸载
```

### yarn list

查看 yarn 全局安装的包

```sh
yarn global list --depth=0
```

### yarn config

使用 yarn 配置包下载源链接

```sh
# 查看源列表
yarn config list

# 查看当前源
yarn config get registry

# 配置指定源
yarn config set registry
```

### 使用 yrm

yrm 是 yarn 的源管理器，可以使用该命令快捷切换源，操作方式与 nrm 大致相同。

```sh
# 安装
yarn global add yrm

# 查看源
yrm ls

# 配置淘宝源
yrm use taobao
```

## Node.js 开发工具

[**node-dev**](https://github.com/fgnass/node-dev)

Node 脚本开发工具，监听指定文件，当文件被修改时会自动重启 node 进程

```sh
# 安装
npm i -g node-dev

# 运行
node-dev src/server.ts
```

### 让 Node.js 支持运行 TS

安装以下工具

```sh
yarn global add ts-node ts-node-dev typescript
# 或者 npm i -g ts-node ts-node-dev typescript
```

[**ts-node**](https://github.com/TypeStrong/ts-node)

让 TypeScript 在 Node 环境运行

```sh
# 安装
npm i -g typescript
npm i -g ts-node

# 运行
ts-node script.ts
```

[**ts-node-dev**](https://github.com/wclr/ts-node-dev)

支持 TS 的 `node-dev`，相当于 `ts-node` + `node-dev` 的结合版

```sh
# 安装
npm i -g ts-node-dev

# 运行
ts-node-dev index.ts
```

## http-server

主要用于便捷开启一个本地测试地址

安装

```sh
yarn global add http-server 
# 或者 npm i -g http-server
```

安装后可以使用简化命令 `hs`

要在当前目录下开启 `http-server` 可以运行

```sh
http-server -c-1 .
```

## 参考文章

- [npm CLI](https://docs.npmjs.com/cli/v8)
- [yarn CLI](https://classic.yarnpkg.com/en/docs/cli/)
- [pnpm](https://pnpm.io/zh/)
- [http-server](https://github.com/http-party/http-server)
- [nrm](https://github.com/Pana/nrm)
- [yrm](https://github.com/i5ting/yrm)