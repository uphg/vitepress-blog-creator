---
title: 环境搭建 - 命令行插件
date: 2019-09-10 21:31:23

tags:
  - 命令行
---

本教程只在 Windows 生效

## `z` 命令

z 命令是一个快捷跳转目录的命令，可以记录你每次经常进入的目录，只要输入该目录文件名即可跳转。

![cli-plugin](/images/bash-z.png)

1. 首先打开 `z` 命令 GitHub 仓库：[https://github.com/rupa/z](https://github.com/rupa/z)
2. 找一个安全的目录（此处推荐在用户目录下新建一个 GitHub 目录）

  ```sh
  cd ~/GitHub
  ```

3. 在该目录下克隆 z 命令的仓库

  ```sh
  git clone git@github.com:rupa/z.git
  ```

4. 进入你克隆的仓库，复制该仓库的地址

  ```sh
  cd z
  pwd # /c/Users/xxx/z
  ```

5. 使用编辑器打开用户目录下的 `.bashrc` 文件（没有就创建一个）

  ```sh
  start ~/.bashrc
  ```

6. 在 .bashrc 中添加以下内容

  ```sh
  . ~/GitHub/z/z.sh 
  # or /c/Users/xxx/GitHub/z/z.sh

  alias j='z'
  ```

7. 运行 `source ~/.bashrc` 使命令生效

## tree 命令

1. 打开官网：[http://gnuwin32.sourceforge.net/packages/tree.htm](http://gnuwin32.sourceforge.net/packages/tree.htm)
2. 选择 Complete package, except sources 那一行下载完整包，如图：

![cil-used](/images/bash-tree.png)

3. 安装成功后在用户目录下的 `.bashrc` 输入

```text
export PATH="$PATH:/C/Software/GnuWin32/bin"
```

> 其中 $PATH: 后的路径为 tree 安装路径下的 bin 路径（注意路径中的 `\` 要修改为 `/` 格式）

4. `. ~/.bashrc` 一下，再运行 `which tree` 如果出现了安装路径就说明成功了。
5. 使用 `tree .` 即可查看当前目录下文件。

## 翻译插件

安装

```sh
yarn global add fanyi
# or
npm install -g fanyi
```

使用

```sh
fy hi
```

## 配置 git 命令

### git log

配置一个更直观的 git log 命令，在 `~/.bashrc` 文件中添加如下内容（用户目录下的 `.bashrc`）

```sh
alias glog="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit -- | less"
```

添加后执行 `. ~/.bashrc`，然后就可以使用 glog 命令查看当前 git 仓库的历史的提交了

其他命令缩写：

```text
alias gst="git status -sb"
alias ga="git add"
alias gc="git commit -v"
alias gcc="git commit . -m update"
alias gp="git push"
alias gl="git pull"
```

## 安装 Ubuntu

在 Win10 的 Microsoft Store 搜索 Ubuntu 安装即可

在 Ubuntu 中 Windows 目录都在 /mnt/ 下，如 c 盘为 `/mnt/c/`

#### 快捷打开目录

```sh
ln -s /mnt/c/xxx/GitHub/
```

  设置后直接使用 cd GitHub 即可打开该目录

#### 打开文件管理器

默认模式下，打开当前目录要运行以下命令

```sh
explorer.exe .
```

你可以将 `explorer.exe` 设置为 `start`，步骤如下：

> 1. 执行 `vi ~/.bashrc` 用 vim 打开配置文件。
> 2. 按 `i` 然后在最下方插入 `alias start="explorer.exe"`。
> 3. 然后运行 `:wq` 保存。
> 4. 就可以使用 `start .` 打开目录了。

#### 开启 root 模式

使用 `sudo passwd root` 设置 root 的密码 (默认情况下密码在命令行不会显示)

设置后输入 `su root` 输入密码进入

#### 在 Cmder 中添加 Ubuntu

首先打开设置，在启动中设置以下选项

![cil-used](/images/ubuntu_01.png)

然后就可以在 Cmder 中新建 Ubuntu 窗口了

也可以把 Ubuntu 设置为默认启动，如下

![cil-used](/images/ubuntu_02.png)

## 常用命令

#### 读取配置

```sh
source ~/.bashrc
# 缩写
. ~/.bashrc
```

#### 打开指定文件

```sh
start demo.sh
```

#### 配置快捷命令

将 `z` 命令赋给 j（类似变量）以后就可以使用 j 代替 `z` 命令，如下：

```sh
alias j='z'
```

## 常用快捷键
  
#### 搜索历史

首先按一下 `Ctrl` + `R` 然后输入命令 的一部分

然后会显示历史命令，然后按住 `Ctrl` 再按 `R` 切换历史命令，直到切换到自己想要的，按方向键左右键即可退出

如果是需要的命令 按方向键左右即可在当前行显示该命令

如果不想搜索 使用 `Ctrl` + `Go` 退出搜索

#### 删除当前行

按下 `ctrl` + `a` 到达命令首字母，然后再按下 `ctrl` + `k` 删除本行命令

####  其他快捷键

- 光标移至行首 `Ctrl + A`
- 光标移至行尾 `Ctrl + E`
- 光标退后 `Ctrl + B`
- 光标前进 `Ctrl + F`
- 删一个单词 `Ctrl + W`
- 中断命令 `Ctrl + Cancel`
- 使用上一条命令的最后一个参数 `Alt + .`

**更多快捷键**

谷歌搜索 `bash 快捷键`，推荐网址：[https://linuxtoy.org/archives/bash-shortcuts.html](https://linuxtoy.org/archives/bash-shortcuts.html)