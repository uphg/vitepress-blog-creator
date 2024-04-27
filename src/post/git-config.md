---
title: 环境搭建 - Git 配置
tags:
  - 命令行
categories:
  - 教程
date: 2019-08-08 22:31:32
---

## 配置 Git

在 Git Bash 命令行运行这五句话

```sh
git config --global user.name xxxxxx       # 把 xxxxxx 替换成你的英文名字随便什么都行
git config --global user.email yyyyyy      # 把 yyyyyy 替换成你的邮箱跟 GitHub 不一致也行
git config --global push.default simple
git config --global core.quotepath false
git config --global core.editor "vim"      # 使用 vim 编辑提交信息
```

## 配置 GitHub

1. 进入 [https://github.com/settings/keys](https://github.com/settings/keys)
2. 如果页面里已经有一些 key，就点「delete」按钮把这些 key 全删掉。如果没有，就往下看
3. 点击 New SSH key，你需要输入 Title 和 Key，但是你现在没有 key，往下看
4. 打开 Git Bash
5. 复制并运行 `rm -rf ~/.ssh/*` 把现有的 ssh key 都删掉，这句命令行如果你多打一个空格，可能就要重装系统了，建议复制运行。
6. 运行 `ssh-keygen -t rsa -b 4096 -C "你的邮箱"`，注意填写你的邮箱！
7. 按回车三次
8. 运行 `cat ~/.ssh/id_rsa.pub`，得到一串东西，完整的复制这串东西
9. 回到上面第 3 步的页面，在 Title 输入「我的第一个 key」
10. 在 Key 里粘贴刚刚你你复制的那串东西
11. 点击 Add SSH key
12. 回到 Git Bash
13. 运行 `ssh -T git@github.com`，看到以下提示，输入 yes 回车
    ```sh
    Are you sure you want to continue connecting (yes/no)?
    ```
14. 如果你看到如下内容，就说明你失败了，请回到第 1 步重来，是的，回到第 1 步重来
    ```sh
    Permission denied (publickey).
    ```
    如果你看到如下内容，就说明你成功了！
    ```sh
    Hi FrankFang! You've successfully authenticated, but GitHub does not provide shell access.
    ```

::: tip 注意

配置了上面的设置后，在使用 GitHub 的时候尽量使用 SSH 地址

:::


## 配置 Git 关联多个远程仓库

注意：以下教程是多个仓库使用相同邮箱的情况，可不看。

#### 1. 在 Gitee 和 GitHub 中添加 SSH key

首先复制用户目录下的 `.ssh` 文件夹中的 `id_rsa.pub` 文件的内容

```sh
cat ~/.ssh/id_rsa.pub
```

会显示类似如下的东西

```csharp
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDZbvgUEj3XAXH4HkW27ibdXgV6VHdrA9/WdSDHtiiC55mjPvxj3OtPxIbpeJmhWyHiJWR6
uUuK+gkb//O51uWCPhHqxKR7+45tZ9jHqXW+hEKPp+odQgc+3hiHAjTkn3JGeIJlQp2UdJCDHBrp+kcgVeg91+y7cU3ufaUQ/hpD
rCgn6uvwjwJgnDhV9DYi+gFUFe7LUwa1o4nfwg43ycuOOuT7c6VO2dj/0pLRUVTPQYu/C3kaaPVedir7mKIu/dM6Ec44bhYTp1Dq
qp8BO42Cfo+n+dempqYTe2wcPvuDjSj884IATc/KvBfc86Yd2Uj7NI7li90Y3i6adoxUIWQh xxx@xxx.com
```

登录 Gitee 和 Github 在它们的设置中找到 SSH Keys 的设置并添加上面的 key

#### 2. 创建配置文件

在 .ssh 文件夹中创建 config (没有后缀)文件，添加以下内容以区分两个远程仓库

```sh
# gitee
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa

# github
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
```

::: details 上述配置文件字段概述 

- Host<br>
   它涵盖了下面一个段的配置，我们可以通过他来替代将要连接的服务器地址。
   这里可以使用任意字段或通配符。
   当ssh的时候如果服务器地址能匹配上这里Host指定的值，则Host下面指定的HostName将被作为最终的服务器地址使用，并且将使用该Host字段下面配置的所有自定义配置来覆盖默认的/etc/ssh/ssh_config配置信息。
- Port<br>
   自定义的端口。默认为22，可不配置
- User<br>
   自定义的用户名，默认为git，可不配置
- HostName<br>
   真正连接的服务器地址
- PreferredAuthentications<br>
   指定优先使用哪种方式验证，支持密码和秘钥验证方式
- IdentityFile<br>
   指定本次连接使用的密钥文件

:::

#### 3. 测试远程仓库连接是否正常

测试 GitHub

```sh
ssh -T git@github.com
# 成功提示：
Hi yourname! You've successfully authenticated, but GitHub does not provide shell access.
```

测试 Gitee

```sh
ssh -T git@gitee.com
# 成功提示：
Welcome to Gitee.com, yourname!
```

#### 4. 报错问题

如果出现类似 `ssh_dispatch_run_fatal` 的报错

找到 C 盘的 hosts 文件，添加报错中的路由地址，格式如下：

```
xxx.xx.xx.xxx gitee.com
```