---
title: 静态服务器
---

## 安装 ts-node-dev

支持 TypeScript 的 Node 静态服务器

```sh
yarn global add ts-node-dev
```

## 创建一个 http 服务器

监听本地端口

```ts
import * as http from "http";
import type { IncomingMessage, ServerResponse } from "http";

const server = http.createServer();

// 每次请求，都会触发箭头函数
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url, headers } = request
  response.end('hi' + '\n'); // 结束响应
});

// 监听本地 8888 端口
server.listen(8888);
```

运行 ts-node-dev 插件

```sh
ts-node-dev index.ts
```

使用 curl 命令请求 8888 端口的地址

```sh
curl -v http://localhost:8888/demo
```

可以在 `server.listen(port)` 中传入一个回调函数，获取监听信息

```ts
server.listen(8888, ()=>{
  console.log(server.address()) // 监听信息
});
```

## 获取 POST 请求的数据

模拟 POST 请求，只要加一个 `-d "name=Ject"` 即可

```sh
curl -v -d "name=Ject" http://localhost:8888/
```

通过监听 request 的 data、end 事件处理数据（数据是分段上传的，所以要放在数组中处理）

```ts
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const array = []
  request.on('data', (chunk) => {
    array.push(chunk)
  })
  request.on('end', () => {
    const body = Buffer.concat(array).toString()
    console.log(body); // name=Ject
    response.end('hi' + '\n');
  })
});

server.listen(8888);
```

可以在 end 事件中修改响应头内容

```ts
request.on('end', () => {
  const body = Buffer.concat(array).toString()
  response.statusCode = 404
  response.setHeader('T-avengers', `I'm Iron Man`)
  response.write('1\n')
  response.write('2\n')
  response.write('3\n')
  response.end(); // 结束相应
})
```

使用 `curl -v http://localhost:8888/demo` 请求会返回以下内容

```sh
*   Trying ::1:8888...
* Connected to localhost (::1) port 8888 (#0)
> GET /demo HTTP/1.1
> Host: localhost:8888
> User-Agent: curl/7.73.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 404 Not Found
< T-avengers: I'm Iron Man
< Date: Wed, 24 Mar 2021 13:59:57 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
1
2
3
* Connection #0 to host localhost left intact
```

## 根据 url 返回不同文件

案例代码

```ts
import * as http from "http";
import * as fs from "fs";
import * as p from "path";
import type { IncomingMessage, ServerResponse } from "http";

const server = http.createServer();
// relative 表示拼接两个路径， __dirname: 表示当前文件绝对路径
const publicDir = p.resolve(__dirname, 'public')

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url, headers } = request
  switch(url) {
    case '/index.html':
      fs.readFile(p.resolve(publicDir, 'index.html'), (error, data)=>{
        if (error) throw error
        response.end(data.toString())
      })
      break;
    case '/style.css':
      response.setHeader('Content-Type', 'text/css; charset=utf-8');
      fs.readFile(p.resolve(publicDir, 'style.css'), (error, data)=>{
        if (error) throw error
        response.end(data.toString())
      })
      break;
    case '/main.js':
      response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
      fs.readFile(p.resolve(publicDir, 'main.js'), (error, data)=>{
        if (error) throw error
        response.end(data.toString())
      })
      break;
  }
});
```

## 处理路径中的查询参数

默认情况下，如果文件路径附带查询参数，会导致上面的代码跳转失败，可以使用 url.parse 解决这个问题

```ts
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url: path, headers } = request
  const { pathname, search } = url.parse(path) // 获取不带查询参数的请求路径，及查询参数
  console.log(pathname, search) // "/index.html", "?id=1007"
})
```

处理完查询参数后，上面根据获取路径的文件的代码可以优化为如下两行（不考虑 `Content-Type` 属性的情况）

```js
fs.readFile(p.resolve(publicDir, filename), (error, data) => {
  response.end(data);
});
```

最新版已弃用 `url.parse()` 使用 `new URL()` 代替，[官方文档](https://nodejs.org/docs/latest-v12.x/api/http.html#http_message_url)

```js
const { method, url: path, headers } = request;
const { pathname, search } = new URL(path, `http://${headers.host}`);
```

使用 curl 添加查询参数请求

```sh
curl -v http://localhost:8888/index.html?id=1007
```

## 处理非 GET 请求

假如首页有以下表单

```html
<form action="/form" method="post" autocomplete="off">
  <label>用户名<input type="text" name="username"></label>
  <button type="submit">提交</button>
</form>
```

为了防止发送该请求，可以添加以下内容

```js
if (method !== 'GET') {
  response.statusCode = 405;
  response.end('这是一个假响应');
  return;
}
```

处理其他错误

```js
if (error) {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (error.errno === -4058) {
    response.statusCode = 404;
    fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
      response.end(data);
    });
  } else if (error.errno === -4068) {
    response.statusCode = 403;
    response.end('没有权限访问该目录');
  } else {
    response.statusCode = 500;
    response.end('服务器繁忙，请稍后再试');
  }
}
```

## 设置文件缓存时间

```js
// 请求成功后，添加 setHeader
let cacheAge = 3600 * 24 * 365; // 缓存 1 年
response.setHeader('Cache-Control', `public, max-age=${cacheAge}`);
response.end(data);
```

这样请求过的文件再次请求就会直接读取本地缓存