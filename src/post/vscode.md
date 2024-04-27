---
title: VSCode 配置
---

## 配置 Git Bash

在新版 VSCode 中关联 Git Bash，需要配置两个属性

Ctrl + Shift + P 搜索 setting，选择 打开设置（json），添加如下配置：

```json
{
  "terminal.integrated.profiles.windows": {
    "Git-Bash": {
      "path": ["C:\\Software\\cmder\\vendor\\git-for-windows\\bin\\bash.exe"],
    },
  },
  "terminal.integrated.defaultProfile.windows": "Git-Bash",
}
```

注意，其中的 path 应该是你的 Git Bash 的文件路径，此处只是我的配置示例

## 自动保存/格式化

`Ctrl` + `Shift` + `P` 搜索 Settings 选择：`打开设置(ui)`，在设置中搜索以下内容进行配置

1. 设置自动保存：auto save
2. 保存时自动格式化：format on save

### 配置根据 ESLint 自动格式化

`Ctrl` + `Shift` + `P` 搜索 Settings 选择：`打开设置(json)`，在设置中添加以下配置

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": false // 关闭编辑器自带保存格式化功能
}
```

## 快捷键

1. 代码格式化快捷键 `Ctrl` + `Shift` + `P` 搜索 format document 即可看到，可自定义。
2. `Ctrl` + `F` 查找
3. `Ctrl` + `H` 替换
4. `Ctrl` + `P` 查找文件
5. `Ctrl` + `Shift` + `P` 输入命令

查找替换时可以指定某段代码替换，如图：

![vscode](/images/VSCode_18.png)

## 配置字体

1. 在谷歌中搜索：fira code

2. 选择 GitHub 的连接，如图：

   ![vscode](/images/VSCode_11.png)
   
3. 点击这里进入，下载最新版本。图示：

   ![vscode](/images/VSCode_12.png)
   
4. 下载后解压，进入 otf 文件夹，全选，然后右键会有一个安装选项，点击安装即可。图示：

   ![vscode](/images/VSCode_021.png)
   
5. 在 VSC 中设置 ，进入设置 -> 搜索 字体  -> 在字体设置中输入

   ```
   Fira Code, Consolas, 'Courier New', monospace
   ```

## 命令操作

**多行内容分行包裹**

1. 输入命令 emmet wrap 选择 输入缩写包裹个别行 如图：

   ![vscode](/images/VSCode_15.png)
   
2. 在弹出的窗口中输入 标签缩写 + *  按下回车即可多行包裹，图示：

   ![vscode](/images/VSCode_16.png)
   

**直接输入命令 wrap 可以选择代码是否自动换行**

如图：

![vscode](/images/VSCode_17.png)


## 关于 json 格式文件的报错提示

### 原因

因为某些原因无法连接到 Schema

### 解决方法

1. [Stack Overflow](https://stackoverflow.com/questions/47691993/file-package-json-severity-warning-message-problems-loading-reference)
1. 在 User settings.json 中添加 `"json.schemaDownload.enable": false`



## 安装插件

- 方便 git 操作：Git Easy
- 英文代码拼错提示：Code Spell Checker

**主题插件推荐**

1. Material Theme 中的 Material Theme Palenight
2. Palenight Theme