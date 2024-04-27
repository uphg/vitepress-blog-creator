---
title: TypeORM 数据库实践
date: 2022-04-30T22:37:48+08:00
tags:
  - Node.js
  - TypeORM
---

代码地址：[github.com/uphg/nextjs-blog-demo](https://github.com/uphg/nextjs-blog-demo)

## 运行 Type ORM

首先在项目根目录创建 `post-data` 并把它添加到 .gitignore

然后运行

```js
docker run -v "$PWD/blog-data":/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=blog -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres:12.2
```

查看容器状态

```sh
# 查看容器的运行状态
docker ps -a

# 查看启动日志
docker logs 容器id
```

## 验证 pg

进入 docker 容器

```sh
docker exec -it 容器id bash
```

进入 pg 命令行

```sh
psql -U blog -W
# 默认设置了不需要密码
# 如果需要添加密码，可在 docker run 选项里的 -e POSTGRES_HOST_AUTH_METHOD=trust 替换成 -e POSTGRES_PASSWORD=123456
```

执行 pg 命令

```sh
\l 用于 list databases，目前有一个 blog 数据库
\c 用于 connect to a database（连接数据库，如：\c blog）
\dt 用于 display tables，目前我们没有 tables
```

## 创建数据库

用 SQL 来创建数据库

- 因为 TypeORM 没有提供单纯的创建数据库的API（差评）
- 创建命令 `CREATE DATABASE xxx ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';`
- 我们需要创建三个数据库：开发、测试、生产
- 对应英文：development、test、production
- 最终创建三个数据库：blog_development、blog_test、blog_production

## 安装 TypeORM

步骤参考自[Getting Started](https://typeorm.io/#installation)

安装相关依赖 `yarn add typeorm reflect-metadata @types/node pg`

修改 tsconfig 添加如下内容

```json
{
  "compilerOptions": {
    ...
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    ...
  }
}
```

git commit 当前修改（因为之后的步骤会覆盖当前内容）

运行 `npx typeorm init --database postgres`

恢复修改的文件

```sh
git checkout HEAD -- .gitignore
git checkout HEAD -- tsconfig.json
```

修改 `src/data-source.ts`

```ts
import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "blog",
  password: "",
  database: "blog_development",
  synchronize: true,
  logging: false,
  entities: [/* User */],
  migrations: [],
  subscribers: [],
})
```

修改 src/index.ts 内容

```ts
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {
  console.log(AppDataSource)
  AppDataSource.close()
}).catch(error => console.log(error))

```

TypeORM 的 tsconfig 配置

```json
{
  "compilerOptions": {
    "lib": [
      "es5",
      "es6"
    ],
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./build",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true
  }
}
```

## 运行 TypeScript

- Next.js 默认使用 babel 来将 TypeScript 编译为 JavScript（内置功能）
- TypeORM 推荐使用 ts-node 来编译（非内置）
- babel 和 ts-node 对 TypeScript 的支持并非完全一致
- 所以我们必须进行统一，全部用 babel

## 连接数据库

安装 babel 相关依赖

```sh
yarn add @babel/cli @babel/core
```

尝试运行 ts 文件

```sh
npx babel ./src --out-dir dist --extensions ".ts,.tsx"
```

### 解决 `Support for the experimental syntax 'decorators-legacy' isn't currently enabled` 报错

安装插件 `yarn add -D @babel/plugin-proposal-decorators`

在 Next.js 中添加 `.babelrc` 配置，参考[官方文档](https://nextjs.org/docs/advanced-features/customizing-babel-config)

```js
{
  "presets": ["next/babel"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```

删除 `src/entity/User.ts` 文件和相关引用，再次运行 `npx babel ./src --out-dir dist --extensions ".ts,.tsx"` 打包

打包后运行 dist 下的 js 文件 `node dist/index.js`

### 解决 `Column type for User#firstName is not defined and cannot be guessed` 报错

在 User.ts 中声明类型

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  firstName: string

  @Column('text')
  lastName: string

  @Column('int')
  age: number

}
```

## 禁用 sync

- 将 `synchronize: true` 改为 `false`
- 如果为 true，那么在连接数据库时，typeorm 会自动根据 entity 目录来修改数据表
- 假设 entity 里有 User，就会自动创建 User 表

看起来很方便，为什么要禁用

- 因为 sync 功能可能会在我们修改 User 时直接删除数据
- 这种行为绝对不能发生在生产环境
- 所以我们要一开始就杜绝 sync 功能

## 创建表（通过 migration）

确保当前数据库没有表，如果有就 `drop table xxx;` 删除指定表

步骤

```sh
# 查看已运行容器
docker ps

# 进入指定容器
docker exec -it xxx bash

# 进入 blog 账号
psql -U blog

# 查看数据库
\l

# 连接 blog_development 表
\c blog_development

# 查看当前数据库中的表
\dt

# 删除指定表
drop table typeorm_metadata;
```

## 创建 Post 表

运行

```sh
npx typeorm migration:create src/migration/CreatePost
```

得到 `src/migration/{timestamp}CreatePost.ts`，并添加如下内容（参考[文档](https://typeorm.io/migrations#using-migration-api-to-write-migrations)） 

```ts
import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreatePost1651393775049 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.createTable(
      new Table({
        name: "posts",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true, // 主键
            isGenerated: true, // 自动创建
            generationStrategy: 'increment' // 创建策略：自增长
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: 'content',
            type: 'text'
          }
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.dropTable('posts')
  }

}
```

在 data-source.ts 中添加如下配置

```ts
export const AppDataSource = new DataSource({
  ...,
  entities: [
    'dist/entities/**/*.js'
  ],
  migrations: [
    'dist/migration/**/*.js'
  ],
  subscribers: [
    'dist/subscribers/**/*.js'
  ]
})
```

运行 migration（数据迁移）

```sh
# 编译为 JS 文件
npx babel ./src --out-dir dist --extensions ".ts,.tsx"

# 升级（创建 posts 表）
yarn typeorm migration:run -d src/data-source.ts
# 降级（删除 posts 表）
yarn typeorm migration:revert -d src/data-source.ts
```

**解决 `Cannot use import statement outside a module` 报错**

使用 `typeorm-ts-node-commonjs migration:run -d src/data-source.ts` 代替 `typeorm migration:run -d src/data-source.ts`

或者将 typeorm-ts-node-commonjs 添加到 package.json 中 `"typeorm": "typeorm-ts-node-commonjs"`，然后运行 `yarn typeorm migration:run -d src/data-source.ts`

## 快捷运行命令

- npx 在 Windows 上运行很慢
- 默认会从 `node_modules/.bin` 里找命令
- 推荐将命令直接写在 package.json 的 scripts 中

让 babel 自动 build

- npx babel --help 可以看到有 `-w` 选项（监听文件更改自动 build）
- 我们还可以让 yarn dev 同时运行 next dev 和 babel -w
- 但 Windows 不支持 & 操作，只有 Linux / Mac 支持
- 于是搜索 `npm run tasks in parallel`
- 安装 `concurrently` 代替 & 操作


## 使用 concurrently

安装

```sh
yarn add -D concurrently
```

在 package.json 中添加配置如下

```json
{
  ...
  "scripts": {
    "dev": "concurrently \"next dev\" \"babel -w ./src --out-dir dist --extensions .ts,.tsx\""
  }
}
```

## 数据源映射到实体

**背景**

- 刚刚只是在数据库里创建了 Post，代码如何读写 Post 呢
- 答案：将数据映射到 Entity（实体）
- 运行命令：`yarn typeorm entity:create src/entity/Post`

**声明 Post 中的类型**

```ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('text')
  content: string;
}
```

**如何使用实体**

- [EntityManager](https://typeorm.io/#/working-with-entity-manager) 或 [Repository](https://typeorm.io/working-with-repository)

## EntityManager API

- `manager.find(User, { name: 'jack' })`
- `manager.create(User, { name: 'jack' })`
- `manager.save(user1)`
- `manager.save([user1, user2, user3])`
- `manager.remove(user1)`（用到了事务）
- `manager.update(User, 1, { name: 'jack' })`
- `manager.delete(user1, 1)`（没有用到事务）
- `manager.findOne(user1, 1)`（只查找符合条件的第一项）

**封装思路**

- 把所有操作都放在 manager 上
- 把 User 类、user1 对象和其他参数传给 manager

**创建一篇文章**

在 `src/index.ts` 中添加以下内容

```ts
const posts = await AppDataSource.manager.find(Post)
const p = new Post()
p.title = 'Post 1'
p.content = '我的第一篇文章'
await AppDataSource.manager.save(p)
const posts2 = await AppDataSource.manager.find(Post)
```

打开 blog_development 数据库，运行 `select * from posts` 查看表中是否有该数据

## Repository API

**举例**

```js
const userRepository = getRepository(User)
await userRepository.findOne(1)
await userRepository.save(user)
```

**封装思路**

- 通过 User 构造一个 repo 对象
- 这个 repo 对象就只操作 User 表

**特色**

- [TreeRepository](https://typeorm.io/#/tree-entities) 和 MongoRepository
- 目前暂时用不到

## 总结

**migration 数据迁移**

- 数据库迁移（升级和降级）

**entity 实体**

- 用类和对象来操作数据表和数据行

**connection 连接**

- 一个数据库连接，默认最多 10 个连接
- 这种模式叫做连接池，可以参考[这篇文章](https://juejin.cn/post/6844903602939494414)

**manager/repo**

- 两种 API 封装风格，用于操作 entity

## Seed

也叫数据填充

- 现在数据库有了，数据表 posts 也有了
- 我们可以通过 seed 脚本来构造数据
- 这比我们写一个网页加一个表单造数据简单的多
- 一般不在生产环境中运行 seed 脚本

好处

- 方便你的同事快速运行项目
- 不然你就会被吐槽：请问你创建的这个表怎么填充数据
- 为了防止被新同事烦，你应该写 seed 脚本


## 关于 Cannot access 'xxx' before initialization 报错解决方案

表关联关系相互引用问题，参考 TypeORM 官方 issues：https://github.com/typeorm/typeorm/issues/4190

将类对象改为字符串形式即可，如下

```js
// 之前的写法
// Photo.ts
@ManyToOne(type => User, user => user.photos)
  user: User;

// User.ts
@OneToMany(type => Photo, photo => photo.user)
  photos: Photo[];

// 修改后的写法
// Photo.ts
@ManyToOne('User', 'photos')
  user: User;

// User.ts
@OneToMany('Photo', 'user')
  photos: Photo[];
```
