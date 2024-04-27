---
title: 操作数据库
date: 2021-11-06T12:10:12+08:00
tags:
  - Docker
---

## 安装 Docker（Windows）

1. 注册：[https://hub.docker.com/](https://hub.docker.com/)
2. 下载：[Docker for Windows Installer](https://docs.docker.com/docker-for-windows/install/)
3. 确认输入 `docker --version` 后返回版本号
4. 设置国内镜像，镜像的地址为：`https://docker.mirrors.ustc.edu.cn/`

  ![Docker 添加国内镜像](/images/docker-configures-domestic-mirrors.jpg)

5. 给 Docker 配置自己的阿里云镜像

  ![阿里云容器镜像加速配置](/images/alibaba-cloud-container-image-acceleration.jpg)
  
5. 确保命令行输入 `docker run hello-world` 时输出 Hello from Docker!
6. 如果无法安装新版，请查看旧版教程


::: details 安装旧版 Docker

1. [下载 Docker Toolbox](https://github.com/docker/toolbox/releases)
2. 打开 Docker QuickStart，运行后看到一个IP，退出（运行 `docker-machine ip` 可得到 IP）
3. 重新打开命令行，输入 `docker -v` 查看是否正常
4. 设置国内镜像，[教程](http://guide.daocloud.io/dcs/daocloud-9153151.html#Docker加速器-DockerToolbox)，镜像的地址为：`https://docker.mirrors.ustc.edu.cn/`
5. 确保命令行输入 `docker run hello-world` 时输出 Hello from Docker!

:::

## 安装 nginx 

1. 在 `c/html` 目录下创建一个 index.html 文件

2. 运行安装命令

  ```sh
  docker run --name nginx1 -v //c/html:/usr/share/nginx/html:ro -d -p 8080:80 nginx:1.21.1
  ```

3. 访问 `http://127.0.0.1:8080/`

## 安装 mysql

使用 docker 创建一个 mysql 数据库（[教程](https://hub.docker.com/_/mysql)）

```sh
# docker run --name mysql123 -e MYSQL_ROOT_PASSWORD=123456 -p 3306:3306 -d mysql:5.7.33
docker run --name mysql-demo1 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7.35
```

关于参数

```sh
--name   数据库名称
 -e      设置密码
 -p      设置端口
 -d      安装的 mysql 版本
```

## Docker 常用命令

```sh
docker ps                           # 查看运行状态
docker container start mysql-demo1  # 开启刚刚关闭的容器
docker kill mysql-demo1             # 关掉指定容器（指定名称或ID）
docker rm mysql-demo1               # 删除指定容器，-f 强制
```

## 连接 mysql

**（1）进入容器**

```sh
docker exec -it mysql-demo1 bash
```

**（2）链接数据库**

```docker
root@771a103a5f24:/# mysql -u root -p
Enter password:
```

**（3）查看数据库列表**

```sh
mysql> show databases; # 必须加分号
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
```

**（4）使用其中一个数据库**

```sh
mysql> use mysql;
```

**（5）查看数据表列表**

```sql
mysql> show tables;
+---------------------------+
| Tables_in_mysql           |
+---------------------------+
| columns_priv              |
| db                        |
| engine_cost               |
| time_zone_transition_type |
| user                      |
+---------------------------+
31 rows in set (0.00 sec)
```

**（6）查看指定表的内容**

```sql
mysql> select * from user;
```

**（7）删除数据库**

```sql
# 删除 db1 数据库
mysql> drop database db1;
```

**（8）删除数据表**

```sql
# 删除 users 表
mysql> drop table users
```

::: tip 注意

Ctrl + D 可以退出当前环境，键入 `\c` 清除当前输入语句。

:::

## DBMS

用来管理数据库，俗称数据库管理系统，例如：MySQL、**PostgreSQL**、SQL Server、DB2、Oracle

DBMS 的结构图

![DBMS 结构图](/images/dbms-system-diagram.png)

## 使用 Node.js 创建数据库

```js
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456'
});

connection.connect(); // 连接数据库

/* 创建一个名为 cheng 的数据库 */
connection.query('CREATE DATABASE IF NOT EXISTS cheng DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;', function (error, results, fields) {
  if (error) throw error;
  console.log('创建数据库');
  console.log(results);
});

/* 使用 cheng 数据库 */
connection.query('use cheng')
/* 创建一个名为 user 的表 */
connection.query(`CREATE TABLE IF NOT EXISTS user(
  name text,
  age int
)`, function (error, results, fields) {
  if (error) throw error;
  console.log('创建表');
  console.log(results);
});

connection.end();
```

使用命令查看创建的数据表

```sh
# 查看所有库
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| cheng              |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)

# 选择 cheng 数据库
mysql> use cheng;

# 显示数据库的表
mysql> show tables;
+-----------------+
| Tables_in_cheng |
+-----------------+
| user            |
+-----------------+
1 row in set (0.00 sec)

# 显示 user 表
mysql> describe user;                             
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| name  | text    | YES  |     | NULL    |       |
| age   | int(11) | YES  |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
2 rows in set (0.00 sec)
```

## 操作数据表内容

```sh
# 在 user 表添加数据
mysql> insert into user (name, age) values ('ject', 18);

# 修改 user 表中 name 为 ject 的数据，将它的 age 字段改为 70
mysql> update user set age=70 where name='ject';

# 不要使用以下方式修改，会将数据库中所有 age字段都修改
mysql> update user set age=18;

# 查询 user 表所有字段
mysql> select * from user;

# 查询 user 表中的指定字段
mysql> select name,age from user;

# 只查询该字段的前十行
mysql> select name,age from user limit 10;
```

::: tip 注意

查询命令只在表内有数据的情况下才会显示该表

:::

## 数据类型

- 数字类型：[https://dev.mysql.com/doc/refman/8.0/en/numeric-type-syntax.html](https://dev.mysql.com/doc/refman/8.0/en/numeric-type-syntax.html)
- 字符串类型
- 时间和日期类型，推荐关注 ISO 8601 及 [如何把日期输出为 ISO 8601 格式](https://stackoverflow.com/questions/9321809/format-date-in-mysql-select-as-iso-8601)
- JSON 类型（5.7.8以上版本）
- 其他特殊类型

## 数字类型

- bit
- tinyint
- bool,boolean
- smallint
- mediumint
- int
- bigint
- decimal
- float
- doule
- serial 等价于 bigint unsigned not null auto_increment unique

> 具体查看[数值数据类型](https://dev.mysql.com/doc/refman/8.0/en/numeric-types.html)，其中 [] 表示可选

**使用 serial 类型添加用户 id 案例**

```sql
# 添加一列 id
mysql> alter table user add id serial;

# 查看列表
mysql> describe user;
+-------+---------------------+------+-----+---------+----------------+
| Field | Type                | Null | Key | Default | Extra          |
+-------+---------------------+------+-----+---------+----------------+
| name  | text                | YES  |     | NULL    |                |
| age   | int(11)             | YES  |     | NULL    |                |
| id    | bigint(20) unsigned | NO   | PRI | NULL    | auto_increment |
+-------+---------------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

# 添加一条数据
mysql> insert into user (name, age) values ('uphg', 18);

# 查询该列表数据，会发现多了一列自增长的 id，这就是 serial 类型
mysql> select * from user;
+----------+------+----+
| name     | age  | id |
+----------+------+----+
| xiaofang |   18 |  1 |
| xiaohong |   18 |  2 |
| uphg     |   18 |  3 |
+----------+------+----+
3 rows in set (0.00 sec)
```

## 字符串类型

- char(100)
- varchar(100)
- binary(1024)
- varbinary(1024)
- blob
- text
- enum('v1', 'v2')
- set('v1', 'v2')

> 具体查看[字符串数据类型](https://dev.mysql.com/doc/refman/8.0/en/string-types.html)

## 时间类型

- date
- time
- datetime
- timestamp
- year

> 具体查看[日期和时间数据类型](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-types.html)

这里着重看一下 ISO 8601，[如何把日期输出为 ISO 8601 格式](https://stackoverflow.com/questions/9321809/format-date-in-mysql-select-as-iso-8601)，用于传给前端的时间格式

## Todo

- Sequalize.js 的用法

## 关于问题搜索

- 搜索 docker 安装 mysql：`docker mysql`
- 搜索判断是否存在语句：`mysql 5.7 create database if not exists`
- 搜索关于 utf8mb4 编码的问题：`mysql 5.7 create database utf8mb4`

## 添加 nginx

教程地址（谷歌搜索 `docker nginx`）：[https://hub.docker.com/_/nginx](https://hub.docker.com/_/nginx)

配置命令

```bash
# 配置 Windows下 D 盘的 html 目录
# -p 配置端口号
docker run --name nginx-demo1 -v //d/html:/usr/share/nginx/html:ro -d -p 8080:80 nginx:1.21.3
```

## 推荐文档

- 在 [https://devdocs.io/](https://devdocs.io/) 中搜索 PostgreSQL 添加其中的 v11 版本到自己的常用文档（Enable）。
