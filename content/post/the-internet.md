---
title: HTTP
date: 2020-04-15 07:11:52
---

## WWW 的发明

1990年 万维网（World Wide Web）出生的年份。这一年 Tim Berners-Lee 发明了用网址就能访问网页的办法，他发明了第一个网页、第一个浏览器和第一个服务器。

Tim Berners-Lee（下文中称为李爵士）在 1989 年至 1992 年间，发明了 WWW（World Wide Web），一种适用于全世界的网络。主要包含三个概念

- URI，俗称网址
- HTTP，两个电脑之间传输内容的协议
- HTML，超级文本，主要用来做页面跳转

URL 的作用是能让你访问一个页面，HTTP 的作用是让你能下载这个页面，HTML 的作用是让你能看懂这个页面。这是一个简单而完美的系统。李爵士除了发明了这些概念，还付诸了行动：

- 发明了第一个服务器
- 发明了第一个浏览器
- 写出了第一个网页，地址：`info.cern.ch` ，注：网站与网页是不同的，网站是有很多网页的，网页只是一个页面。

## URI 是什么

U(统一)R(资源)I(标识符)

URI 分为 URL 和 URN 两种

### URN

URN(统一资源名称)

`ISBN: 9787115275790` 就是一个 URN，通过 URN 你可以确定一个「唯一的」资源。

此处的 `ISBN: 9787115275790` 对应的资源的是《JavaScript 高级程序设计（第三版）》这本书。基本上你去任何一个图书馆、书店，他们都知道是这本书。

### URL

URL(统一资源定位符)

`baidu.com` (二级域名) 与  `www.baidu.com` (三级域名) 共用一个二级域名

- `.com` 为顶级域名
- `baidu` 为二级域名
- `www` 为三级域名

## DNS

D(域)N(名)S(系统): 域名系统

功能

- 输入域名
- 输出IP

查询域名对应的IP命令

```sh
$ nslookup baidu.com
$ ping baidu.com
```

通过DNS服务器解析域名，得到网址

### 指定 IP

可以给域名一个指定的 IP (绕过 DNS 自己指定一个 IP ),例:

在 hosts 文件中给百度添加指定域名

```
127.0.0.1 baidu.com
```

- 特殊情况下，可以通过在 hosts 中给谷歌设置指定IP来达到科学上网的效果(由于设定原因，服务器[电信等网络]可能给你返回一个假的IP)
- 本方法不够稳定，因为谷歌的IP会不定时改变

## Server + Client + HTTP

Server(服务器) Client(客户端) HTTP(协议)

### 常用端口

- 21 端口：FTP服务
- 443 端口：HTTPS
- 1080 端口：代理服务器端口
- 3306 端口：MySQI服务器
- 80 端口：HTTP协议

### HTTP

HTTP的作用就是指导浏览器和服务器如何进行沟通，例如

- 请求的网址错误：返回404
- 请求的服务器不在线(或服务器正在重启)：返回502

## 请求和响应

**请求**

- 如果请求体内容为 JSON
- 那么请求头就要设置 `Content-Type: application/json`
- 这一规范可以在 MDN 的[常见 MIME 类型列表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)查看

**响应**

- 如果响应体的内容为 JSON
- 那么相应的，响应头就要有 `Content-Type: application/json`

## curl 命令

基本用法

```sh
curl -s -o nul -v "https://www.baidu.com"
```

使用 POST 请求

```sh
curl -X POST -s -v -H "Sun: xxx" "https://www.baidu.com"

# 传值
curl -X POST -d "123456789" -s -v -H "Sun: xxx" -- "https://www.baidu.com"
```

### 常用选项

| 选项 | 全称         | 说明                                                         |
| ---- | ------------ | ------------------------------------------------------------ |
| `-s` | `--silent`   | 用于隐藏进度条                                               |
| `-v` | `--verbose`  | 显示请求和响应，如果没有这个就只会显示响应                   |
| `-X` | `--request`  | 设置请求方式，如 `-X POST`                                   |
| `-d` | `--data`     | POST 请求添加的参数，如 `-d "123456789"`                     |
| `-H` | `--header`   | 添加一个响应头，如：`-H "Sun: xxx"`                          |
| `-o` | `--output`   | 将输出写入指定文件，如：抑制输出 HTML 文本内容 `-o nul`，Linux 要将 nul 改成 `/dev/null` |
| `-L` | `--location` | 自动重定向                                                   |

### 内容

- `*` 开头的是注释
- `>` 开头的是 HTTP 请求
- `<` 开头的是 HTTP 响应

请求示例

请求体部分内容示例

```
> GET / HTTP/1.1
- GET 请求方式
- / 请求路径
- HTTP　请求协议
- 1.1 版本号

> Host: www.baidu.com
告诉服务器我访问的域名

> User-Agent: curl/7.64.0
请求/响应使用的工具(软件)以及版本

> Accept: */*
表示接收请求返回的任何内容
```


响应体部分内容示例

```
< Content-Length: 9
请求传入的内容长度

< Content-Type: application/x-www-form-urlencoded
请求的类型

< # upload completely sent off: 9 out of 9 bytes
完整的上传了9个字节的数据
```
