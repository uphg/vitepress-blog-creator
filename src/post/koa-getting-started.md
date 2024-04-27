---
title: Koa 入门
date: 2022-03-19T09:38:31+08:00
---

## Koa

历史：2013 年 8 月，TJ 开始编写 Koa，2015 年 8 月，Koa 发布 v1.0.0 版本。

Koa 中间件模型

![Koa 中间件模型](/images/koa-middleware.jpg)

## 创建一个 Koa 服务

安装依赖

```sh
yarn add koa
yarn add -D @types/koa
tsc --init
```

创建 `server.ts`

```ts
import Koa from 'koa'

const app = new Koa()

app.use(async (context, next) => {
  context.body = 'hello'
  await next()
  context.body += ' Jack'
})

app.use(async (context, next) => {
  context.body += ' world'
  await next()
})

app.use(async (context, next) => {
  context.set('Content-Type', 'text/html; charset=utf-8')
})

app.listen(3000)
```

运行

```js
ts-node-dev server.ts
```

## 创建一个 Koa 中间件

创建一个记录 Hello World 打印总用时的中间件

```js
import Koa from 'koa'

const app = new Koa()

app.use(async (context, next) => {
  context.body = 'hello'
  await next()
  const time = context.response.get('X-Response-Time')
  console.log(`${context.url} - ${time}`)
})

app.use(async (context, next) => {
  const start = Date.now()
  await next()
  const time = Date.now() - start
  context.set('X-Response-Time', `${time}ms`)
})

app.use(async (context, next) => {
  context.body = 'Hello World'
  for (let i = 0; i < 10000; i++) {
    context.body += ' Hello World'
  }
})

app.listen(3000)
```

**改写为 Promise 写法**

```js
app.use(async (context, next) => {
  const start = Date.now()
  return next().then(() => {
    const time = Date.now() - start
    context.set('X-Response-Time', `${time}ms`)
  })
})
```

注意

- 一定要写 return，因为中间件必须返回一个 Promise 对象
- 错误处理在这里写有点反模式，用 `app.on('error')` 更好

**Express 的实现**

参考 [`response-time`](https://github.com/expressjs/response-time) 库，该库依赖 `on-headers` 库实现了计算请求的响应时间方式，基本思路就是重写 `res.writeHead` API，在调用该方法前监听 header，当开始写 header 时就是结束时间。

## app.xxx

[文档](https://koajs.com/#application)

- `app.env`
- `app.proxy`
- `app.subdomainOffset`
- `app.listen()`
- `app.callback()`
- **`app.use(fn)`** --- 插入中间件 fn
- `app.keys`
- `app.context`
- **`app.on('error', fn)`** --- 错误处理
- **`app.emit()`** --- 触发事件

## ctx.xxx

[文档](https://koajs.com/#context)

- `ctx.req` Node.js 封装的 request（请求）
- `ctx.res` Node.js 封装的 response（响应）
- `ctx.request` Koa 封装的 request（请求）
- `ctx.response` Koa 封装的 response（响应）
- `ctx.state` 跨中间件分享数据
- `ctx.app`
- `ctx.cookies.get/set`
- `ctx.throw` 附带信息的抛出错误
- `ctx.assert`
- `ctx.respond` 不推荐使用

Request 委托 & Response 委托

ctx 还实现了 Request 和 Response 的委托方法，例如，你调用 `ctx.body` 就相当于调用 `ctx.response.body`，但由于很难区分是 request 还是 response 的方法，建议还是使用 `ctx.response.xxx` 的方式


## 其他 API

大部分 API 与 express 很相似

### ctx.request.xxx

[文档](https://koajs.com/#request)

- `request.header`
- `request.headers`（`request.header` 的别名）
- **`request.method`**
- `request.length`
- `request.url`
- `request.origin`
- `request.href`
- **`request.path`**
- `request.querystring`
- `request.search`
- `request.host`
- `request.hostname`
- `request.URL`
- `request.type`
- `request.charset`
- **`request.query`**
- `request.fresh`
- `request.stale`
- `request.protocol`
- ...
- **`request.idempotent`** 检查请求是否是幂等的（幂等：多次操作是否会产生一样的影响，如 get 操作）
- **`request.get(field)`**

### ctx.response.xxx

[文档](https://koajs.com/#response)

- `response.header`
- `response.headers`
- `response.socket`
- **`response.status`** 设置响应状态码
- `response.message`
- `response.length`
- **`response.body`** 支持五种类型（`string`、`Buffer`、`Stream`、`Object || Array`、`null || undefined`
- `response.get()`
- **`response.set()`**
- **`response.append()`**
- `response.type`
- `response.is()`
- `response.redirect(url, [alt])`
- `response.attachment()`
- `response.headerSent`
- `response.flushHeaders()`
- ...


## Koa 与 Express 的区别

相同点

- 都是由 TJ 开发，Express 是由 TJ 在 2010 年 6 月 开始编写，2014 年发展到 v0.12，基本成熟，移交 StrongLoop。Koa 是 TJ 在 2013 年 8 月 开始编写，2015 年 8 月，发布 v1.0.0 版本。

区别

- 最主要的区别是中间件的处理方式，Koa 使用的是 U 形 + Generator/await 的方式，让中间件的操作更便捷，并且写法上去除了回调的方式。

优缺点总结

- Express 的优点：文档完善，生态更完善。缺点就是需要每次调用 callback。
- Koa 的优点：没有 callback。缺点是与 Express 的中间件无法复用，基本都需要重新实现。