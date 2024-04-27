---
title: "CSS 引入字体"
date: 2020-09-20T20:01:35+08:00
tags:
  - font-family
---

首先需要字体文件，类似如下类型

```
HankRnd-Black.otf
HankRnd-Black.ttf
```

然后需要一个工具生成本地字体文件，这里我使用 [https://www.fontsquirrel.com/](https://www.fontsquirrel.com/)

打开后点击 Generator，按照如下步骤操作

![图片](/images/fontsquirrel.jpg)

会得到一个压缩包，复制其中如下后缀的文件

```
hankrnd-webfont.woff
hankrnd-webfont.woff2
```

创建一个 `font-family.css` 文件，添加以下内容

```css
@font-face {
  font-family: 'hankrndregular';
  src: url('hankrnd-webfont.woff2') format('woff2'),
    url('hankrnd-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
```

在你的网页中引入该文件，示例

```html
<link rel="stylesheet" type="text/css" href="./font/font-family.css">
```

引入多种 `font-weight`

```css
@font-face {
  font-family: 'SourceHanSansCN';
  font-style: normal;
  font-weight: 400;
  src: url('NotoSansHans-Regular.woff2') format('woff2'),
    url('NotoSansHans-Regular.woff') format('woff');
}
```

字体的几种 `font-weight` 类型

| name          | value |
| ------------- | ----- |
| Thin          | 100   |
| Light         | 300   |
| Regular       | 400   |
| Medium        | 500   |
| Bold          | 700   |
| Black (Heavy) | 900   |

参考文章：[https://www.cnblogs.com/linxue/p/9653780.html](https://www.cnblogs.com/linxue/p/9653780.html)
