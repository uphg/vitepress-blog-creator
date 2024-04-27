# 使用 VuePress(2.x) 添加主题插件

## 自定义文件路由

在插件 API 中添加 `extendsPageOptions` 函数，可以自定义每个 `.md` 文件的路由地址 。

为 `_posts` 目录下的页面设置永久链接 Pattern 示例

```js
module.exports = {
  extendsPageOptions: ({ filePath }, app) => {
    if (filePath?.startsWith(app.dir.source('_posts/'))) {
      return {
        frontmatter: {
          permalinkPattern: '/:year/:month/:day/:slug.html',
        },
      }
    }
    return {}
  },
}
```

## 获取 Pages 对象

可以在 Node 编译后生成一个临时文件，用于存放分页后的 博客目录

写入的临时文件的方法

```js
module.exports = {
  // 在 onPrepared hook 中写入临时文件
  async onPrepared() {
    await app.writeTemp('foo.js', 'export const foo = \'bar\'')
  }
}
```

```js
// 在客户端文件中引入临时文件
import { foo } from '@temp/foo'
```

## 其他内容

###  createPage

创建一个 VuePress Page 对象。

```js
const { createPage } = require('@vuepress/core')

module.exports = {
  // 在 onInitialized hook 中创建一个额外页面
  async onInitialized(app) {
    app.pages.push(
      await createPage(app, {
        path: '/foo.html',
        frontmatter: {
          layout: 'Layout',
        },
        content: `\
# 某个 Page

你好，世界。
`,
      })
    )
  }
}
```

