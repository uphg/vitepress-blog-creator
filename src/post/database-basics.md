---
title: 数据库基础知识
date: 2021-11-05T15:11:32+08:00
tags:
  - 数据库
---

总结数据库基础知识的笔记。

## 范式（NF）

范式（NF）。表示一张数据表的表结构所符合的某种设计标准的级别，数据库范式分为 1NF，2NF，3NF，BCNF，4NF，5NF。一般在我们设计关系型数据库的时候，最多考虑到 BCNF 就够了。

## 第一范式（1NF）

首先是第一范式（1NF）。**1NF 的定义为：符合 1NF 的关系中的每个属性都不可再分。表1**所示的情况，就不符合 1NF 的要求。

![表1](/images/database-first-normal-form-demo1.png)

实际上，**1NF 是所有关系型数据库的最基本要求**，你在关系型数据库管理系统（RDBMS），例如 SQL Server，Oracle，MySQL 中创建数据表的时候，如果数据表的设计不符合这个最基本的要求，那么操作一定是不能成功的。也就是说，只要在 RDBMS 中已经存在的数据表，一定是符合 1NF 的。如果我们要在 RDBMS 中表现表中的数据，就得设计为**表2**的形式：

![表2](/images/database-first-normal-form-demo2.png)

但是仅仅符合 1NF 的设计，仍然会存在数据冗余过大，插入异常，删除异常，修改异常的问题，例如对于**表3**中的设计：

![表2](/images/database-first-normal-form-demo3.jpg)

1. 每一名学生的学号、姓名、系名、系主任这些数据重复多次。每个系与对应的系主任的数据也重复多次——**数据冗余过大**。
2. 假如学校新建了一个系，但是暂时还没有招收任何学生（比如3月份就新建了，但要等到8月份才招生），那么是无法将系名与系主任的数据单独地添加到数据表中去的——**插入异常**
3. 假如将某个系中所有学生相关的记录都删除，那么所有系与系主任的数据也就随之消失了（一个系所有学生都没有了，并不表示这个系就没有了）。——**删除异常**
4. 假如李小明转系到法律系，那么为了保证数据库中数据的一致性，需要修改三条记录中系与系主任的数据。——**修改异常**。

正因为仅符合 1NF 的数据库设计存在着这样那样的问题，我们需要提高设计标准，去掉导致上述四种问题的因素，使其符合更高一级的范式（2NF），这就是所谓的“规范化”。

## 第二范式（2NF）

**定义**

- 在 1NF 的基础上，添加了键。
- 通过键就可以确定一个唯一的值。比如上面的**表3**，通过学号就可以确定对应姓名，那么学号就是姓名的键。
- 有的时候键可以是多个，但是多个键不允许**部分依赖**。比如上面的**表3**，通过学号和课名，就可以唯一确定这个学生的分数，那么学号和课名就是这个分数的键。

**依赖关系**

给出键，就能唯一确定字段的值，如给出学号，就能唯一确定姓名，反之则不行。

部分依赖：姓名依赖与学号，但是学号却不依赖与姓名，这种情况我们就叫做姓名部分依赖与学号。

使用第二范式改进**表3**：

![第二范式示例表](/images/database-second-paradigm.png)

**第二范式的问题**

- 假如想要修改经济系的系主任王强，需要改两处（存在间接依赖）。
- 假如删掉法律系的高芳芳，法律系就不存在了，因为法律系只有一个学生。
- 假如想要创建一个系，还是要必须添加一个学生。

## 第三范式（3NF）

**定义**

一个表里不能有两层以上的依赖（间接依赖）。比如上面选课表：给出学号，就能确定系名，系名依赖于学号。给出系名，就能确定系主任，系主任依赖于系名。所以，系主任间接依赖于学号。

使用第三范式改进**表4**：

![第三范式示例表](/images/database-third-paradigm.png)

现在我们来看一下，进行同样的操作，是否还存在着之前的那些问题？

1. 修改经济系的系主任王强：只需要修改一处。——有改进
1. 删除某个系中所有的学生：该系的信息不会丢失。——有改进
3. 添加一个系：在系表中添加即可。——有改进

## BCNF 范式

要了解 BCNF 范式，那么先看这样一个问题：

若：

1. 某公司有若干个仓库。
2. 每个仓库只能有一名管理员，一名管理员只能在一个仓库中工作。
3. 一个仓库中可以存放多种物品，一种物品也可以存放在不同的仓库中。每种物品在每个仓库中都有对应的数量。

那么关系模式 仓库（仓库名，管理员，物品名，数量） 属于哪一级范式？

答：已知函数依赖集：仓库名 → 管理员，管理员 → 仓库名，（仓库名，物品名）→ 数量<br>
键：（管理员，物品名），（仓库名，物品名）<br>
主属性：仓库名、管理员、物品名<br>
非主属性：数量<br>
∵ 不存在非主属性对键的部分依赖和间接。所以此关系模式属于 3NF。

基于此关系模式的关系（具体的数据）可能如图所示：

![BCNF图示1](/images/database-BCNF-paradigm.png)

好，既然此关系模式已经属于了 3NF，那么这个关系模式是否存在问题呢？我们来看以下几种操作：

1. 先新增加一个仓库，但尚未存放任何物品，是否可以为该仓库指派管理员？——不可以，因为物品名也是主属性，根据实体完整性的要求，主属性不能为空。
2. 某仓库被清空后，需要删除所有与这个仓库相关的物品存放记录，会带来什么问题？——仓库本身与管理员的信息也被随之删除了。
3. 如果某仓库更换了管理员，会带来什么问题？——这个仓库有几条物品存放记录，就要修改多少次管理员信息。

从这里我们可以得出结论，在某些特殊情况下，即使关系模式符合 3NF 的要求，仍然存在着插入异常，修改异常与删除异常的问题，仍然不是“好”的设计。

造成此问题的原因：存在着**主属性**对于键的部分依赖与间接依赖。（在此例中就是存在主属性【仓库名】对于键【（管理员，物品名）】的部分依赖。

解决办法就是要在 3NF 的基础上消除**主属性**对于键的部分与间接依赖。

仓库（仓库名，管理员）
库存（仓库名，物品名，数量）

这样，之前的插入异常，修改异常与删除异常的问题就被解决了。

以上就是关于 BCNF 的解释。

## 范式总结

- 第一范式：属性不可分割（不可具有多重含义）。
- 第二范式：在 1NF 的基础上，字段要完全依赖于键。
- 第三范式：在 2NF 的基础上，字段间没有间接依赖。
- BCNF范式：在 3NF 的基础上，键中的属性也不存在间接依赖。

## 数据库设计经验

### 高内聚

- 把相关的字段放到一起，不相关的字段分开建表。
- 如果两个字段能够单独建表，那就单独建表。

### 低耦合

- 如果两个表之间有弱关系，可以新建一个中间表（关联表）
- 一对一可以放在一个表，也可以两个表加外键。
- 一对多一般使用外键。
- 多对多一般建立中间表。

### 一对一

假设需要做一个学生管理系统，一个学生只能加入一个班级。

**可以把班级放在学生表里**

- （学生表）学生id：1001，姓名：小明，班级id：4002
- （班级表）班级id：4002，名称：入门1班

**也可以单独建立关联表**

- （学生表）学生id：1001，姓名：小名
- （学生班级表）学生id：1001，id：2003，班级id：4002
- （班级表）班级id：4004，名称：入门1班

### 一对多

假设需要做一个出版社的图书管理系统，一个作者出版了多本图书。**可以把书和作者放在一个表里吗？**

某些 DBMS 支持数组，可以存两个 id 到一个字段内

- （作者表）作者id：10001，姓名：阿强，books：[2001, 3002]

> 但是如果 DBMS 不支持数组，就不能这样做了

**单独建立关系表（推荐）**

为了解决上面的问题，我们可以单独建立一个关系表。

- （作者表）作者id：1001，姓名：阿强
- （出版表）id：2001，作者id：1001，书id：4002，出版社id：6003
- （图书表）书id：4002，名称：JavaScript 入门

## JOIN

用来把两个表合并起来，查询一些东西（部分内容参考自 [图解 SQL 里的各种 JOIN](https://zhuanlan.zhihu.com/p/29234064)）

### 基本语法

```sh
table1 {[inner]|{left|right|full} [outer]} join table2 on boolean_expression
```

使用示例

```sql
mysql> select users.name as uname, orders.amount as amount
    -> from users inner join orders
    -> on users.id = orders.user_id;
```

上面的示例做了以下事情

1. 查询 users 表中的 name 字段，别名为 uname，查询 orders 表中的 amount 字段，别名为 amount
2. 关联 users 表与 orders 表
3. 关联条件为 users.id=orders.user_id;

### inner join

inner join 一般被译作内连接。内连接查询能将左表（表 A）和右表（表 B）中能关联起来的数据连接后返回。

![inner join 图示](/images/database-basics-inner-join.png)

### left join

left join 一般被译作左连接，也写作 left outer join。左连接查询会返回左表（表 A）中所有记录，不管右表（表 B）中有没有关联的数据。在右表中找到的关联数据列也会被一起返回。

![left join 图示](/images/database-basics-left-join.png)

### right join

right join 一般被译作右连接，也写作 right outer join。右连接查询会返回右表（表 B）中所有记录，不管左表（表 A）中有没有关联的数据。在左表中找到的关联数据列也会被一起返回。

![right join 图示](/images/database-basics-right-join.png)

### full outer join

full outer join 一般被译作外连接、全连接，实际查询语句中可以写作 full outer join 或 full join。外连接查询能返回左右表里的所有记录，其中左右表里能关联起来的记录被连接后返回。

![full outer join 图示](/images/database-basics-full-outer-join.png)

以上四种，就是 SQL 里常见 join 的种类和概念了，看一下它们的合影：

![四种基本 join 图示](/images/database-basics-join-bases.png)

下面是 join 的延伸用法

### left join excluding inner join

返回左表有但右表没有关联数据的记录集。

![left join excluding inner join 图示](/images/database-basics-left-join-excluding-inner-join.png)

### right join excluding inner join

返回右表有但左表没有关联数据的记录集。

![right join excluding inner join 图示](/images/database-basics-right-join-excluding-inner-join.png)

### full outer join excluding inner join

返回左表和右表里没有相互关联的记录集。

![full outer join excluding inner join 图示](/images/database-basics-full-outer-join-excluding-inner-join.png)

### 总结

以上七种用法基本上可以覆盖各种 join 查询了。全家福

![七种常用 join 图示](/images/database-basics-join-all.png)


### 使用 inner join 关联两个表

首先创建一个数据库

```sql
# 创建数据库 db1
mysql> create database db1 character set utf8mb4 collate utf8mb4_unicode_ci;

# 查看所有数据库
mysql> show databases;

# 使用 db1 数据库
mysql> use db1;
```

然后创建几个表，其中员工表用来记录商店的收银员，订单表用来记录用户消费的订单。

```sql
# 创建 用户表，有 id（自增长序列）和 name（字符串）两个属性
mysql> create table users (id serial, name text);

# 创建 员工表，有 id（自增长序列）和 name（字符串）两个属性
mysql> create table staffs (id serial, name text);

# 创建 订单表，用来记录用户消费的订单，它有：id、user_id、staff_id、amount 这几个属性
mysql> create table orders (id serial, user_id bigint unsigned, staff_id bigint unsigned, amount int unsigned);
```

在表中创建几条记录

```sql
mysql> insert into users (name) values ('XiaoMing');
mysql> insert into users (name) values ('Jack');
mysql> insert into staffs (name) values ('XiaoHong');
mysql> insert into staffs (name) values ('ZhangSan');
mysql> insert into orders (user_id, staff_id, amount) values (1, 1, 100); # 记录一笔 XiaoMing 消费的 100 元订单
mysql> insert into orders (user_id, staff_id, amount) values (2, 1, 100); # 记录一笔 Jack 消费的 100 元订单
mysql> insert into orders (user_id, staff_id, amount) values (2, 2, 320); # 记录一笔 Jack 消费的 320 元订单
```

查看已创建表的数据

```sql
mysql> select * from users;
```

使用 inner join 关联用户表（users）和订单表（orders），来展示更清晰的消费订单记录。

```sql
mysql> select users.name as uname, orders.amount as amount
     > from users inner join orders
     > on users.id = orders.user_id;
+----------+--------+
| uname    | amount |
+----------+--------+
| XiaoMing |    100 |
| Jack     |    100 |
| Jack     |    320 |
+----------+--------+
3 rows in set (0.00 sec)
```

## 缓存字段

- 假如要获取一个博客的评论数
- 如果每次获取都通过查询所有评论来获取会很慢
- 我们可以添加一个缓存字段，比如 `comment_count`
- 每次添加博客 +1，每次删除博客 -1
- 像这样的字段就叫缓存字段

## 事务

- 一个用户评论以后，后台需要做两件事情
- 第一步，在 comments 表中新增记录
- 第二步，在 blogs 表中将对应的 comment——count 字段 +1
- 如果第一步执行后，第二步还没有执行怎么办（比如服务器断电等情况）
- 这样就会造成数据错误
- 这时就可以使用事务，事务主要用于处理连续的操作，只要有一次操作不成功，就不会执行后面的操作

使用事务执行数据库操作

```sql
mysql> create table users (id serial, name text);
mysql> begin;  # 开始事务
mysql> insert into users (name) values ('ZhangSan');
mysql> insert into users (name) values ('LiSi');
mysql> commit; # 提交事务

mysql> select * from users;
+----+----------+
| id | name     |
+----+----------+
|  1 | ZhangSan |
|  2 | LiSi     |
+----+----------+
2 rows in set (0.00 sec)
```

只要事务没有提交，就可以回滚

```sql
mysql> begin;      # 开始事务
mysql> insert into users (name) values ('WangWu');
mysql> rollback;   # 回滚
 
mysql> select * from users; # 因为回滚了，所以数据没有插入
+----+----------+
| id | name     |
+----+----------+
|  1 | ZhangSan |
|  2 | LiSi     |
+----+----------+
2 rows in set (0.00 sec)
```

## 参考文章

- [如何理解关系型数据库的常见设计范式？](https://www.zhihu.com/question/24696366/answer/29189700)<br>
- [图解 SQL 里的各种 JOIN](https://zhuanlan.zhihu.com/p/29234064)
- [MySQL 教程](https://www.runoob.com/mysql/mysql-tutorial.html)
- [数据库事务 - 维基百科](https://zh.wikipedia.org/wiki/数据库事务)
- [数据库索引 - 维基百科](https://zh.wikipedia.org/wiki/数据库索引)

