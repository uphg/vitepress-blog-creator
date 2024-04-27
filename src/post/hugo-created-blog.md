---
title: "Hugo 搭建个人博客"
categories:
  - 博客
tags:
  - Hugo
date: 2020-05-23T17:15:21+08:00
draft: false
---

此教程只适用于在 Windows10 环境下搭建。其他系统在官网自行查询教程即可。

## 安装

去Github下载：https://github.com/gohugoio/hugo/releases

通常选择 `hugo_X.XX.X_Windows-64bit.zip` 或者 `hugo_extended_X.XX.X_Windows-64bit.zip`（拓展版）即可，部分博客可能需要安装拓展版。

下载后最好解压到一个无空格无中文的目录。

解压后在我的电脑中配置环境，分别按照以下步骤点击：

右键此电脑 > 属性 > 高级系统设置 > 环境变量 > 选择「系统变量」下的 `Path` 编辑，在 `Path` 中添加 hugo 的安装路径。

图示：

![hugo](/images/blog-hugo-path1.jpg)

![hugo](/images/blog-hugo-path2.jpg)

安装后运行以下命令，检查版本

```sh
hugo version
```

看到类似以下内容，表示安装成功

```sh
Hugo Static Site Generator v0.58.3/extended windows/amd64 BuildDate: unknown
```

## 搭建博客

官方文档：https://gohugo.io/

### 创建博客目录

```sh
hugo new site quickstart
```

### 给博客添加默认主题

```sh
# 进入博客根目录
cd quickstart
# 初始化一个git仓库
git init
# 下载默认博客主题
git submodule add https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
```

### 将主题添加到站点配置中

```sh
echo 'theme = "ananke"' >> config.toml
```

### 创建一篇博客

```sh
hugo new posts/my-first-post.md
```

### 修改博客属性

将博客下 `draft: true` 修改为 `draft: false`（draft 为 true 表示该博客为草稿状态，不会展示）

```markdown
---
title: "My First Post"
date: 2019-03-26T08:47:11+01:00
draft: true
---
```

### 开启一个hugo测试服务器

```sh
hugo server -D
```

### 配置网站

打开博客根目录下的 `config.toml` 文件，修改其中的配置

baseURL 表示博客的域名。

theme 表示博客所用的主题。

title 表示博客标题。

languageCode 表示博客所用语言。

```toml
baseURL = "https://example.org/"
languageCode = "en-us"
title = "My New Hugo Site"
theme = "ananke"
```

## 添加脚本文件

### 推送博客至仓库

在博客根目录下创建一个名为 `add.sh` 的文件，并添加以下内容：

```
# 确保脚本抛出遇到的错误
set -e

# 删除之前的文件
rm -rf public/

# 生成静态文件
hugo

# 进入生成的文件夹
cd public

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'update'

# 如果发布到 https://<USERNAME>.github.io  USERNAME=你的用户名 
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>  REPO=github上的项目
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

配置后运行以下命令即可推送博客：

```sh
sh add.sh
```

### 快捷新建文章

在博客根目录下创建一个名为 `new.sh` 的文件，并添加以下内容：

```sh
# 判断第一个参数是否存在，-z表示第一个参数的长度为0，也就是不存在
# 如果不存在，就将title的值命名为：日期+blog+当前时间 的格式创建
# 如果存在，就将title的值命名为：日期+参数 的格式创建
if [ -z $1 ];then
%Y-%m-%d %H:%m:%S
title="`date +"%Y-%m-%d-blog%H%M%S"`"
else
title="`date +"%Y-%m-%d"`-$1"
fi

hugo new posts/"${title}.md"
```

创建后运行以下命令即可：

```sh
sh new.sh "新博客"
```

> 注：脚本文件可以去掉 `.sh` 后缀，运行时输入 `sh add`  或 `sh new "新博客"` 即可

## 拓展

### 修改博客主题

1. 选择一个喜欢的主题：https://themes.gohugo.io/

2. 按照主题的说明文档配置主题

3. 修改博客根目下 `config.toml` 中的 theme 属性

4. 运行 `hugo server -D` 测试主题



