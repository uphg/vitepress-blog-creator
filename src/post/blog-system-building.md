---
title: 博客系统搭建
date: 2022-05-08T19:35:07+08:00
---

使用 Next.js + TypeORM 搭建博客系统

## 创建三个表

博客系统应该最少包含三个表 User、Post、Comment 分别表示用户、博客、评论

User 表

```ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
    id: string;
  @Column('varchar')
    username: string;
  @Column('varchar')
    passwordDigest: string;
  @CreateDateColumn()
    createdAt: Date;
  @UpdateDateColumn()
    updatedAt: Date;
}
```

Post 表

```ts
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('increment')
    id: string;
  @Column('varchar')
    title: string;
  @Column('text')
    content: string;
  @CreateDateColumn()
    createdAt: Date;
  @UpdateDateColumn()
    updatedAt: Date;
}
```

Comment 表

```ts
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
    id: number;
  @Column('text')
    content: string;
  @CreateDateColumn()
    createdAt: Date;
  @UpdateDateColumn()
    updatedAt: Date;
}
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

**添加它们的关联**

User

```ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
    id: string;
  @Column('varchar')
    username: string;
  @Column('varchar')
    passwordDigest: string;
  @CreateDateColumn()
    createdAt: Date;
  @UpdateDateColumn()
    updatedAt: Date;
  @OneToMany('Post', 'author')
    posts: Post[];
  @OneToMany('Comment', 'user')
    comments: Comment[];
}
```

Post

```ts
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('increment')
    id: string;
  @Column('varchar')
    title: string;
  @Column('text')
    content: string;
  @CreateDateColumn()
    createdAt: Date;
  @UpdateDateColumn()
    updatedAt: Date;
  @ManyToOne('User', 'posts')
    author: User;
  @OneToMany('Comment', 'post')
    comments: Comment[];
}
```

Comments

```ts
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
    id: number;
  @Column('text')
    content: string;
  @CreateDateColumn()
    createdAt: Date;
  @UpdateDateColumn()
    updatedAt: Date;
  @ManyToOne('User', 'comments')
    user: User;
  @ManyToOne('Post', 'comments')
    post: Post;
}
```

## 获取博客列表

通过 TypeORM 连接数据库，获取博客列表数据

封装 getDataSource，方便在 Next.js 中连接数据库

```ts
import { AppDataSource } from "src/data-source"

export const getDataSource = async () => {
  if (AppDataSource.isInitialized) {
    return AppDataSource
  } else {
    return AppDataSource.initialize()
  }
}
```

获取分页的博客列表

```ts
const myDataSource = await getDataSource()
const [posts, count] = await myDataSource.manager.findAndCount(Post, {
  skip: (page - 1) * perPage,
  take: perPage
})
```

## 创建博客

**处理未登录**

1. 后端发现未登录返回 401
2. 前端发现 401 提示用户未登录，跳转登录页，并在登录页的 url 上 添加 returnTo 参数，方便登陆后退回当前页面
3. 前端登录成功后，再次返回 returnTo 所指的页面

**复用 React 组件页面**

假如有一个 about.jsx 组件文件

```js
function About() {
  return <div>About</div>
}

export default About
```

index.jsx 想要复用该组件，可直接引用该组件并导出

```js
import About from './about.jsx'
export default About
```

## 分页怎么做

1. 获取查询参数 page = n
2. 计算 skip: (N - 1) * perPage 和 take: perPage
3. 把数据、count、perPage、page 传给页面
4. 前端显示数据、count、page

perPage：每页多少个
skip：跳过的数量
take：获取多少个

## docker 化

参考 Node.js [官方文档](https://nodejs.org/zh-cn/docs/guides/nodejs-docker-webapp/)

创建 Dockerfile `touch Dockerfile` 添加以下内容

```sh
FROM node:12

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn*.lock ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
```

添加排除配置 `.dockerignore` 防止复制镜像时复制无用文件

```sh
node_modules
*.log
```

创建一个网络，参考[官方文档](https://docs.docker.com/engine/reference/commandline/network/)

```sh
docker network create network1
```

运行数据库容器时指定该网络，并将数据库命名为 psql1

```sh
docker run --net=network1 --name=psql1 -v "/$PWD/blog-data":/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=blog -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres:12.2
```

打包当前 Next.js 项目

```sh
yarn build
```

进入根目录，构建你的镜像

```sh
docker build . -t jack/node-web-app
```

运行镜像

```sh
docker run --name=node1 --network=network1 -p 3000:3000 -dit jack/node-web-app
```

查看当前镜像运行状态

```sh
docker logs node1
```

修改 TypeORM 的 host 配置

```ts
export const AppDataSourceOptions: DataSourceOptions = {
  host: "psql1",
  port: 5432,
  ...
}

export const AppDataSource = new DataSource(AppDataSourceOptions)
```

## 将项目上传到阿里云

购买一个阿里云服务器 ECS，购买后复制该服务器的公网IP，打开 bash 命令，添加以下内容

```sh
ssh root@<IP>
```

运行后会提示你输入密码，密码就是阿里云服务器 root 账户的密码

### 使用 ssh 登录机器

运行快捷命令复制你的 ssh 公钥到服务器

```sh
# 运行以下命令，将当前机器 ssh copy 至
ssh-copy-id root@<IP>
```

如果失败，按照如下方式可以手动复制

首先使用命令登录远程服务器

```sh
# 复制当前主机公钥
cat ~/.ssh/id_rsa.pub

# 登录远程服务器
ssh root@<IP>

# 进入远程服务器的 ssh 配置
cd ~/.ssh

# 编辑 authorized_keys，将当前主机的公钥复制至该文件即可
vi authorized_keys
```

## 添加 hosts 配置

打开目录 `c/Windows/System32/drivers/etc`

添加示例：`116.62.24.71 dev1`

添加后就可以使用 `ssh root@dev1` 方式登录远程服务器

## 在服务器上创建用户

默认使用 root 用户操作权限过大，所以我们需要单独创建一个用户用于操作 blog

在远程服务器运行

```sh
# 创建 blog 用户
adduser blog

# 切换至 blog 用户
su - blog

# 修改 blog 用户密码
passwd blog

# 添加 ssh 公钥
cd ~
mkdir .ssh
cd .ssh
touch authorized_keys
vi authorized_keys
# 粘贴自己的 ssh 公钥
```

## 用 root 安装 docker

参考[官方文档](https://docs.docker.com/engine/install/ubuntu/)，在 服务器的 root 用户下安装 ubuntu 版本的 docker

注意在运行 apt-get instal 时按照以下命令指定版本安装

```sh
apt-get install docker-ce=5:19.03.12~3-0~ubuntu-bionic docker-ce-cli=5:19.03.12~3-0~ubuntu-bionic containerd.io=1.2.13-2 docker-compose-plugin=2.5.0~ubuntu-bionic
```

## 将 blog 用户加到 docker 分组

```sh
# 进入 blog 用户
su - blog

# 查看是否存在 docker
which docker

# linux list all groups
cat /etc/group

# Ctrl + D
logout

# linux add user to group
usermod -a -G docker blog

# 再次进入 blog
su - blog

# 运行 docker
docker run hello-world
```

## 使用 git clone 下载代码

给 blog 用户生成 ssh key

```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

在你的 GitHub 账户添加该 ssh key

## 运行 blog 中的 项目

参考 Node.js [官方文档](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)在 Ubuntu 中安装 Node.js，在运行安装命令后，它会提示你是否需要安装 yarn，内容如下

```sh
## Run `sudo apt-get install -y nodejs` to install Node.js 14.x and npm
## You may also need development tools to build native addons:
     sudo apt-get install gcc g++ make
## To install the Yarn package manager, run:
     curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
     echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
     sudo apt-get update && sudo apt-get install yarn
```

按照它的提示内容安装 yarn

在 blog 用户根目录下创建 blog-data 目录，表示当前数据库目录

```sh
# 查看相关命令运行历史
history | grep 'docker run'

# 在当前服务器创建数据库
docker run --net=network1 --name=psql1 -v /home/blog/blog-data/:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=blog -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres:12.2
```

## 配置环境变量

```sh
# 查看当前环境变量
env

# 指定当前 NODE_ENV 环境变量
export NODE_ENV=production

# 输入当前命令按 Tab
vi ~/.bash

# 编辑 .bashrc，在第一行添加 export NODE_ENV=production
vi ~/.bashrc

# 查看是否存在 NODE_ENV
echo $NODE_ENV
```

安装后按照 README 文档步骤运行数据库和当前 Next.js 项目

## 添加阿里云安全策略

打开 云服务器 ECS 控制台，选择当前实例的 操作 -> 更多 -> 网络和安全组 -> 安全组配置，进入后选择 配置规则 -> 手动添加

添加时选择 协议类型：自定义TCP（默认），端口范围：3000。

## 自动化部署

开启服务器

移动服务器中的当前项目至 app 目录

```bash
mv -f nextjs-blog-demo/* ./
mv -f nextjs-blog-demo/.* ./
```

在 package.json 中添加 babel 打包命令

```json
{
  "scripts": {
    "dev": "concurrently \"next dev\" \"yarn compile:watch\"",
    "compile:watch": "babel -w ./src --out-dir dist --extensions .ts,.tsx",
    "compile": "babel ./src --out-dir dist --extensions .ts,.tsx",
    ...
  },
  ...
}
```

创建自动化部署命令

```bash
echo 'start';
docker start psql1 && # 启动服务器
cd /home/blog/app/ &&
git pull origin main &&
yarn install --production=false &&
yarn build &&
yarn compile &&
yarn m:run &&
docker build -t jack/node-web-app . &&
docker kill app &&
docker rm app &&
docker run --name=app --net=host -p 3000:3000 -dit jack/node-web-app &&
echo 'OK!'
```

## 报错

解决 `CannotExecuteNotConnectedError: Cannot execute operation on "default" connection because connection is not yet established.` 报错：

检查当前使用数据库是否创建，未创建去创建一个