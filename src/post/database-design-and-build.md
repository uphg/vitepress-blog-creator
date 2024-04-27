---
title: 数据库设计与搭建
date: 2022-05-02T13:51:26+08:00
tags:
  - Node.js
---

## 增删改查的难点

**开发效率**

- 很多人做了五年的 CRUD，开发效率却始终没有变
- 如何做到快速开发？

**代码质量**

- 为何互联网公司的代码大部分都是屎山，难以维护
- 2000 年左右就兴起的单元测试技术，为何还不会用
- 宣称敏捷开发，是否懂得敏捷开发包含单元测试

**前后端联调**

- 为何后端给出的接口前端总是无法流畅使用，需要联调
- 前后端代码交给两个人做，增加的沟通成本是否值得

**伸缩性**

- 数据量变大之后，应用是否还能正常运行
- 业务量增加之后，机器性能是否还扛得住

**高并发 C10k problem**

- 如果 10000 个连接同时进入，怎么保证服务质量
- 课外读物：[如何设计秒杀系统](https://www.zhihu.com/question/54895548)

**安全性和稳定性**

- 怎么防脱裤、MD5 碰撞？怎么防 XSS、CSRF、Replay？
- 怎么备份数据？怎么双活？

**怎么预防脱发、颈椎病、肾结石**

## 一些重要的原则

**过早优化乃万恶之源**

- Premature optimization is the root of all evil
- 如果你没有办法量化性能，就不要尝试优化性能

**开发效率 > 可读性 > 运行效率**

- 对于初创公司，最重要的事情是活下去
- 80% 以上的中国创业公司活不过三年

**可用性 > 易用性 > 美观**

- 不要一开始就在易用性和美观性上浪费太多时间

**永远不要删除数据（敏感数据除外）**

- 尽量软删除，删除前确认


## 自学的最好方式

定一个目标，然后去做，不管结果怎么样，你都会学到东西。

## 需求分析

**博客系统**

- 用户可以登录、注销，但不可以修改密码（功能从简）
- 需要重置密码可以自行联系管理员
- 用户可以对博客进行增删改查
- 用户可以对博客进行评论，但不能修改评论（功能从简）
- 用户不可以编辑用户名、密码、姓名、头像（功能从简）

**可用性要求**

- 手机也能完成上面的操作

**其他要求**

- 对搜索引擎优化

## 思路

**需求**

- 简单的增删改查
- 主要的表有 users/posts/comments

**主要的数据**

- user (id/username/password_digest)
- posts (id/user_id/title/content)
- comments (id/user_id/post_id/content)

**其他**

- 手机适配：设计两套界面 PC + mobile
- SEO：多用 SSG 或 SSR，少用 BSR

## 开始写代码

**创建表**

- 使用 migration

**创建关联**

- 使用 TypeORM 提供的 API

**填充数据**

- 使用 seed 脚本

**创建页面**

- 首页、登录页、注册页

**创建 API**

- `/api/v1/sign_up` 注册
- `/api/v1/sign_in` 登录

**约定前后端接口**

- RESTful
- 约定错误码
- 约定资源格式

**单元测试**

- 成功要测、失败也要测
- 外部依赖不要测

## 操作数据库

**删除之前的容器**

```sh
# 查看所有容器运行状态
docker ps -a

# 关闭指定容器
docker kill 容器id

# 删除指定容器
docker rm 容器id
```

**删除当前数据库**

```sh
# 在 psql 中运行
drop database blog_development;
```

**创建数据库**

```sh
CREATE DATABASE xxx ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';
```

## 创建数据库关联

三个表之间的关联关系

```
users
a user has many post
a user has many comments

posts
a post belongs to a user
a post has many comments

comments
a comment belongs to a user
a comment belongs to a post
```

对应

```
用户
一个用户有很多文章
一个用户有很多评论

文章
一篇文章属于一个用户
一篇文章有很多评论

评论
一个评论属于一个用户
一个评论属于一篇文章
```
