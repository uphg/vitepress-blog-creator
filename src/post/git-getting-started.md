---
title: Git 命令入门
---

## 提交代码

```sh
# 提交至暂存区
$ git add .

# 提交暂存区到仓库区
$ git commit -m [提交说明] 

# 提交时显示所有差异信息 (diff)
$ git commit -v

# 取回远程仓库的变化，并与本地分支合并
$ git pull [远程主机名] [远程分支名]:[本地分支名]

# 上传本地分支到指定远程分支
$ git push [远程主机名] [本地分支名]:[远程分支名]
```

## commit 拓展

```sh
# 撤销上一次的 commit
git reset --soft HEAD^

# 使用一次新的 commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]

# 重做上一次 commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```

## 添加 `.gitignore`

添加 `.gitignore` 后需要清除 git 之前的缓存再重新提交

```sh
git rm -r --cached .
git add .
git commit -m 'update'
```

## 分支

```sh
# 列出所有本地分支
$ git branch

# 列出所有远程分支
$ git branch -r

# 列出所有本地分支和远程分支
$ git branch -a

# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]

# 新建一个分支，并切换到该分支
$ git checkout -b [branch]

# 切换到指定分支，并更新工作区
$ git checkout [branch-name]

# 删除分支
$ git branch -d [branch-name]

# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]

# 将 dev 分支并入 master 分支
$ git checkout master
$ git merge dev
```

<h2>参考文章</h2>

- [常用 Git 命令清单](https://uphg.github.io/store/devbook/often-use-git.html)