---
title: Hexo 搭建博客教程
categories:
  - 博客
tags:
  - Hexo
abbrlink: 1744777162
date: 2019-08-28 19:15:48
---

需要会使用命令行工具，并且有GitHub账号。
这篇文章的主要目的是记录自己搭建博客时踩的坑，所以可能没那么全面
部分内容来自： [Hexo官方文档](https://hexo.io/zh-cn/docs/) 

<!-- more -->

## 在 Github 新建一个仓库

名称格式：

```
username.github.io
```

> 注：username 必须是你的 GitHub 用户名

在新仓库中点击 Settings 下拉，在 GitHub Pages 中点击 Choose a theme ，随便选择一个主题应用

刷新页面会发现 GitHub Pages 中多了一行网址 ，复制这个网址，这个网址就是后面要配置的 URL 的网址

## 环境搭建

安装 Hexo

```
npm install -g hexo-cli
```

查看当前版本

```bash
hexo version
```

博客目录名称

```bash
username.github.io-creator
```

在要创建博客的目录下初始化环境

```
hexo init
```

安装必备的组件

```
npm install
```

## 配置`_config`设置

打开博客根目录下的 `_config.yml` 文件

修改其中的一些配置：
**首先修改URL**

url：你的仓库主页预览网址

root：你的仓库名称 (如果是用户名格式填 / 即可，即 username.github.io)

```yml
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: https://username.github.io/
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:
```

**然后修改 Deployment** 

主要修改 repository 改为你的仓库的下载地址

```yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repository: git@github.com:username/username.github.io.git
  branch: master
```

**可选设置**

命令行新建文章时的名称格式为日期

```yml
new_post_name: :year-:month-:day-:title.md # File name of new posts
```

## 发布更新文章

在根目录下打开命令行

### 安装一个拓展工具(用于向 GitHub 推送文章)

```
npm i hexo-deployer-git
```

详情参考：[将 Hexo 部署到 GitHub Pages](https://hexo.io/zh-cn/docs/github-pages#Private-repository)

### 新建一篇文章

```
hexo new post "article title"
```

文章的目录在 `source\_posts`下

### 生成静态网页

```sh
hexo g
# 全称：hexo generate
```

### 开启本地服务器预览

```sh
hexo s
# 全称：hexo server
```

### 部署到 GitHub

```sh
hexo d
# 全称：hexo deploy
```

 ## 更多相关命令

**清除文件缓存**

```
hexo clean
```

**删除 hexo** 

3.0.0版本执行

```text
npm uninstall hexo-cli -g
```

之前版本执行

```text
npm uninstall hexo -g
```

## 拓展内容

以下是拓展内容，可不看

### 文章

**文件名称**

Hexo 默认以标题做为文件名称，但您可编辑 `new_post_name` 参数来改变默认的文件名称，

举例来说，它的默认值是 `:title.md`，你可以更改为 `:year-:month-:day-:title.md` 可让您更方便的通过日期来管理文章。

| 变量       | 描述                                |
| :--------- | :---------------------------------- |
| `:title`   | 标题（小写，空格将会被替换为短杠）  |
| `:year`    | 建立的年份，比如， `2015`           |
| `:month`   | 建立的月份（有前导零），比如， `04` |
| `:i_month` | 建立的月份（无前导零），比如， `4`  |
| `:day`     | 建立的日期（有前导零），比如， `07` |
| `:i_day`   | 建立的日期（无前导零），比如， `7`  |



**Front-matter**

Front-matter 是文件最上方以 `---` 分隔的区域，用于指定个别文件的变量，举例来说：

```
---
title: Hello World
date: 2013/7/13 20:46:25
---
```

以下是预先定义的参数，您可在模板中使用这些参数值并加以利用。

| 参数         | 描述                                                 | 默认值       |
| :----------- | :--------------------------------------------------- | :----------- |
| `layout`     | 布局                                                 |              |
| `title`      | 标题                                                 |              |
| `date`       | 建立日期                                             | 文件建立日期 |
| `updated`    | 更新日期                                             | 文件更新日期 |
| `comments`   | 开启文章的评论功能                                   | true         |
| `tags`       | 标签（不适用于分页）                                 |              |
| `categories` | 分类（不适用于分页）                                 |              |
| `permalink`  | 覆盖文章网址                                         |              |
| `keywords`   | 仅用于 meta 标签和 Open Graph 的关键词（不推荐使用） |              |

**添加文章描述**

在文章头部的 Front-matter 中添加 `description` 属性来添加描述，如果没有这个属性，默认会自动截取文章内容作为文章的描述。

**给文章添加标签分类**

只有文章支持分类和标签，您可以在 Front-matter 中设置。在其他系统中，分类和标签听起来很接近，但是在 Hexo 中两者有着明显的差别：分类具有顺序性和层次性，也就是说 `Foo, Bar` 不等于 `Bar, Foo`；而标签没有顺序和层次。

```
categories:
- Diary
tags:
- PS3
- Games
```

**删除标签**

首先把每篇文章中那个标签的属性去除，然后执行以下命令，清除之前的缓存

```
hexo clean
```

然后再次 `hexo g` 生页面成即可

## 永久链接插件

插件地址：https://github.com/rozbo/hexo-abbrlink

> 使用方法见文档

**给文章添加 favicon.ico 图标**

首先修改主题文件夹的配置信息：

在根目录 `根目录/themes/xxx/_config.yml`

找到 favicon 并修改为以下路径：

```
favicon: favicon.ico
```

然后将准备好的 `favicon.ico` 图标放到 `hexo/themes/xxx/source` 路径下即可

> 注：xxx 表示你的主题文件的路径，博客主题文件都存放在 `根目录/themes`下
>
> ico 图标转换网站转换：http://www.bitbug.net/

**VSC 安装 stylus 语法高亮**

搜索插件：`language-stylus`

> 使用VSC修改主题样式可以安装

