---
title: Commit message 规范
date: 2021-11-08T17:04:32+08:00
tags:
  - git
---

Git 每次提交代码，都要写 Commit message（提交说明），否则就不允许提交。

```sh
git commit -m "hello world"
```

上面代码的 `-m` 参数，就是用来指定 commit mesage 的。

如果一行不够，可以只执行 `git commit`，就会跳出文本编辑器，让你写多行。

```sh
git commit
```

基本上，你写什么都行

但是，一般来说，commit message 应该清晰明了，说明本次提交的目的。

目前，社区有多种 Commit message 的[写法规范](https://github.com/ajoslin/conventional-changelog/blob/master/conventions)。本文介绍[Angular 规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.greljkmo14y0)，这是目前使用最广的写法，比较合理和系统化，并且有配套的工具。

## Commit message 的作用

格式化的Commit message，有几个好处。

**（1）提供更多的历史信息，方便快速浏览。**

比如，下面的命令显示上次发布后的变动，每个commit占据一行。你只看行首，就知道某次 commit 的目的。

```sh
git log <last tag> HEAD --pretty=format:%s
```

**（2）可以过滤某些 commit（比如文档改动），便于快速查找信息。**

比如，下面的命令仅仅显示本次发布新增加的功能。

```sh
git log <last release> HEAD --grep feature
```

**（3）可以直接从 commit 生成 Change log。**

Change Log 是发布新版本时，用来说明与上一个版本差异的文档，详见后文。

![Change log 示例](/images/git-commit-specification-demo1.png)

## Commit message 的格式

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。

```sh
<type>(<scope>): <subject>
# 空一行
<body>
# 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略。

不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。这是为了避免自动换行影响美观。

### Header

Header 部分只有一行，包括三个字段：`type`（必需）、`scope`（可选）和 `subject`（必需）。

**（1）type**

`type`用于说明 commit 的类别，允许使用下面的标识。

- `feat`：添加新功能（feature）
- `fix`：bug 修复
- `perf`：提高性能的代码修改
- `refactor`：重构（即不是新增功能，也不是修改 bug 的代码变动）
- `style`：代码格式（不影响代码运行的变动）
- `test`：测试修改
- `docs`：文档修改（documentation）
- `build`：影响系统构建，或项目依赖的更改（如：webpack，npm 包等）
- `ci`：命令行配置文件和脚本的更改
- `chore`：其他的修改，例如修改 `.gitignore`

如果 `type` 为 `feat` 和 `fix`，则该 commit 将肯定出现在 Change log 之中。其他情况（`docs`、`chore`、`style`、`refactor`、`test`）由你决定，要不要放入 Change log，建议是不要。

**（2）scope**

`scope` 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

**（3）subject**

`subject` 是 commit 目的的简短描述，尽量不超过 50 个字符。

- 以动词开头，使用第一人称现在时，比如 `change`，而不是 `changed` 或 `changes`
- 第一个字母小写
- 结尾不加句号（`.`）

### Body

Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。

```sh
More detailed explanatory text, if necessary.  Wrap it to 
about 72 characters or so. 

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```

有两个注意点。

1. 使用第一人称现在时，比如使用`change`而不是`changed`或`changes`。

2. 应该说明代码变动的动机，以及与以前行为的对比。

### Footer

Footer 部分只用于两种情况。

**（1）不兼容变动**

如果当前代码与上一个版本不兼容，则 Footer 部分以 `BREAKING CHANGE` 开头，后面是对变动的描述、以及变动理由和迁移方法。

```bash
BREAKING CHANGE: isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

**（2）关闭 Issue**

如果当前 commit 针对某个 issue，那么可以在 Footer 部分关闭这个 issue 。

```bash
Closes #234
```

也可以一次关闭多个 issue 。

```bash
Closes #123, #245, #992
```

### Revert

还有一种特殊情况，如果当前 commit 用于撤销以前的 commit，则必须以 `revert:` 开头，后面跟着被撤销 Commit 的 Header。

```bash
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

Body 部分的格式是固定的，必须写成 `This reverts commit <hash>.`，其中的 `hash` 是被撤销 commit 的 SHA 标识符。

如果当前 commit 与被撤销的 commit，在同一个发布（release）里面，那么它们都不会出现在 Change log 里面。如果两者在不同的发布，那么当前 commit，会出现在 Change log 的`Reverts`小标题下面。

## Commitizen

[Commitizen](https://github.com/commitizen/cz-cli)是一个撰写合格 Commit message 的工具。

### 全局安装

安装

```sh
yarn global add commitizen
# 或者：npm install -g commitizen
```

在项目目录运行以下的命令，使其支持 Angular 的 Commit message 格式

```sh
commitizen init cz-conventional-changelog --save-dev --save-exact
# Yarn
commitizen init cz-conventional-changelog --yarn --dev --exact
```

如果上面的命令报错，可以**手动安装配置该模块**

首先安装 `cz-conventional-changelog`

```sh
yarn add -D cz-conventional-changelog

# 或者
npm i -D cz-conventional-changelog
pnpm add -D cz-conventional-changelog
```

然后配置 `package.json`

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

以后，凡是用到 `git commit` 命令，一律改为使用 `git cz`。这时，就会出现选项，用来生成符合格式的 Commit message。

![Commitizen 运行示例](/images/git-commit-specification-demo2.png)

### 当前项目

也可以只在当前项目中安装使用，这样做的好处就是能保证当前项目的 Commitizen 版本一致。

安装

```sh
yarn add -D commitizen
# 或者：npm install -D commitizen
```

在 `package.json` 中添加运行脚本

```json
{
  "scripts": {
    "cz-init": "commitizen init cz-conventional-changelog --yarn --dev --exact",
    "cz": "cz"
  }
}
```

运行 `yarn cz-init` 初始化 Commitizen，会发现 `package.json` 中多了以下配置

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

然后每次提交的时候运行 `yarn cz` 编写 commit 信息即可

## 使用 Commitlint 校验 message

[commitlint](https://github.com/conventional-changelog/commitlint) 可以检测你的 commit 信息是否符合 Angular 团队的提交规范

安装

```sh
# 安装
yarn add -D @commitlint/config-conventional @commitlint/cli
# 或者：npm install --save-dev @commitlint/config-conventional @commitlint/cli

# 使用常用配置配置 commitlint
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

如果需要在提交之前进行验证，可以添加 `commit-msg` hook（推荐）

```sh
# 安装 Husky v6
npm install husky --save-dev
# 或者
yarn add husky --dev

# 启用 hooks
npx husky install
# 或者
yarn husky install

# 添加 hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

如何卸载

```sh
npm uninstall husky && git config --unset core.hooksPath
```

## 快捷生成 Change log 与版本号

安装插件 [standard-version](https://github.com/conventional-changelog/standard-version)

```sh
# 安装
yarn add -D standard-version
# 或者
npm i --save-dev standard-version
```

添加运行脚本到 `package.json`

```json
// package.json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

然后运行 `yarn release` 即可。

它做了以下事情

- 自动根据 commit message 更新 `package.json` 中的版本号
- 生成 Change log 日志（基于[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)）
- 提交上面的改动。
- 发布版本标签（添加当前版本的 git tag）

## 参考文章

- [Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [如何规范你的Git commit？](https://zhuanlan.zhihu.com/p/182553920)
- [优雅的提交你的 Git Commit Message](https://juejin.cn/post/6844903606815064077#heading-10)
- [Conventional Commit Messages](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)
- [Angular 开发规范](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [语义化版本号（Semantic Versioning）](https://semver.org/lang/zh-CN/)
