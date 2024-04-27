---
title: Hexo 生成永久链接
categories:
  - 博客
tags:
  - Hexo
abbrlink: 3926398327
date: 2020-05-12 19:52:09
top: 1
---

Hexo默认会使用当前文件名生成链接，默认没有随机码生成的方式，使用以下插件，就可以实现。

GitHub链接：https://github.com/rozbo/hexo-abbrlink

也可以按照 GitHub 的文档步骤安装，毕竟官方更新会更及时

## 安装


安装命令

```bash
npm install hexo-abbrlink --save
```

## 使用

配置博客根目录的  `config.yml` 文件

配置文件名格式

```yml
permalink: posts/:abbrlink/
```

配置随机码格式

```yml
# abbrlink config
abbrlink:
  alg: crc32  #support crc16(default) and crc32
  rep: hex    #support dec(default) and hex
```

随机码属性示例

```
crc16 & hex
https://post.zz173.com/posts/66c8.html

crc16 & dec
https://post.zz173.com/posts/65535.html
```

```
crc32 & hex
https://post.zz173.com/posts/8ddf18fb.html

crc32 & dec
https://post.zz173.com/posts/1690090958.html
```

配置完成后重新生成页面即可

```bash
hexo g
hexo s
hexo d
```

生成后会发现每篇文章的头部(`Front-matter`)会自动添加一个属性，如下所示

```
---
title: hexo 生成永久链接
abbrlink: 3926398327
date: 2020-05-12 19:52:09
---
```