---
title: "文件操作命令"
date: 2020-09-01T16:50:39+08:00
---

## 拷贝文件

拷贝 `markdown` 目录下的所有文件到 `a` 文件夹下

```sh
cp -avx markdown/* a/
```

拷贝 markdown 目录下的所有文件到 `a` `b` 文件夹下

```sh
echo a/ b/ | xargs -n 1 cp -r markdown/*

echo a/ b/ | xargs -n 1 cp -avx markdown/*
```

## 重命名

将文件 A 重命名为文件 B

```sh
mv A B
```

## 压缩文件

将`/home/demo/` 这个目录下所有文件和文件夹打包为当前目录下的 `demo.zip`

```sh
zip –q –r demo.zip /home/demo
```

上面的命令操作是将绝对地址的文件及文件夹进行压缩.以下给出压缩相对路径目录

比如目前在home这个目录下,执行以下操作可以达到以上同样的效果.

```sh
zip –q –r demo.zip demo
```

比如现在我的 demo 目录下,我操作的zip压缩命令是

```sh
zip –q –r demo.zip *
```

更多

```sh
rz             # 上传压缩包
unzip [文件名]  # 解压压缩包
```

**`zip` 命令参数列表（linux）**

- `-a` 将文件转成ASCII模式
- `-F` 尝试修复损坏的压缩文件
- `-h` 显示帮助界面
- `-m` 将文件压缩之后，删除源文件
- `-n` 特定字符串 不压缩具有特定字尾字符串的文件
- `-o` 将压缩文件内的所有文件的最新变动时间设为压缩时候的时间
- `-q` 安静模式，在压缩的时候不显示指令的执行过程
- `-r` 将指定的目录下的所有子目录以及文件一起处理
- `-S` 包含系统文件和隐含文件（S是大写）
- `-t` 日期 把压缩文件的最后修改日期设为指定的日期，日期格式为mmddyyyy

**`unzip` 语法**

```sh
unzip [-cflptuvz][-agCjLMnoqsVX][-P <密码>][.zip文件][文件][-d <目 录>][-x <文件>] 或 unzip [-Z]
```

**`unzip` 命令参数列表（linux）**
- `-c` 将解压缩的结果显示到屏幕上，并对字符做适当的转换。
- `-f` 更新现有的文件。
- `-l` 显示压缩文件内所包含的文件。
- `-p` 与`-c`参数类似，会将解压缩的结果显示到屏幕上，但不会执行任何的转换。
- `-t` 检查压缩文件是否正确。
- `-u` 与`-f`参数类似，但是除了更新现有的文件外，也会将压缩文件中的其他文件解压缩到目录中。
- `-v` 执行是时显示详细的信息。
- `-z` 仅显示压缩文件的备注文字。
- `-a` 对文本文件进行必要的字符转换。
- `-b` 不要对文本文件进行字符转换。
- `-C` 压缩文件中的文件名称区分大小写。
- `-j` 不处理压缩文件中原有的目录路径。
- `-L` 将压缩文件中的全部文件名改为小写。
- `-M` 将输出结果送到more程序处理。
- `-n` 解压缩时不要覆盖原有的文件。
- `-o` 不必先询问用户，unzip执行后覆盖原有文件。
- `-P <密码>` 使用zip的密码选项。
- `-q` 执行时不显示任何信息。
- `-s` 将文件名中的空白字符转换为底线字符。
- `-V` 保留VMS的文件版本信息。
- `-X` 解压缩时同时回存文件原来的UID/GID。
- `[.zip文件]` 指定.zip压缩文件。
- `[文件]` 指定要处理.zip压缩文件中的哪些文件。
- `-d <目录>` 指定文件解压缩后所要存储的目录。
- `-x <文件>` 指定不要处理.zip压缩文件中的哪些文件。
- `-Z unzip` -Z 等于执行 zipinfo 指令