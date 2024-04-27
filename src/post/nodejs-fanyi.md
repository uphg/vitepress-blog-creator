---
title: 命令行翻译工具
---

项目地址：[https://github.com/uphg/node-fanyi-demo](https://github.com/uphg/node-fanyi-demo)

## Node.js 发送请求

向百度发送一个 GET 请求，[官方文档](http://nodejs.cn/api/https.html#https_https_request_url_options_callback)

```js
import * as https from "https";

const options = {
  hostname: 'www.baidu.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`请求头: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`请求的数据: ${chunk}`);
  });
  res.on('end', () => {
    console.log('请求数据结束');
  });
});

req.on('error', (e) => {
  console.error(`报错信息: ${e.message}`);
});

req.end();
```

## 获取百度翻译 API

打开[百度翻译API平台](https://fanyi-api.baidu.com/)的：产品与服务 > 通用翻译API 中的 接入举例/拼接完整请求，按照示例拼接完整的翻译请求（默认为GET方式）

## 在请求中添加查询参数

```js
import * as querystring from 'querystring';
const query = querystring.stringify({
  name: 'ject', age: 12, gender: '女',
});
// query 将转换为 name=ject&age=12&gender=%E5%A5%B3
```

