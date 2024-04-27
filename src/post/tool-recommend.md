---
title: Windows 常用工具

date: 2019-08-14 14:13:54
---

一些常用的小工具

<!-- more -->

## Windows Terminal

[Windows Terminal](https://www.microsoft.com/zh-cn/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab) 是微软推出的一款命令行工具，对 Window 系统的兼容性很好。

![Windows Terminal](/images/windows-terminal.jpg)

### 常用快捷键

1. 左右分屏：<kbd>alt</kbd>+<kbd>shift</kbd>+<kbd>+</kbd>
2. 上下分屏：<kbd>alt</kbd>+<kbd>shift</kbd>+<kbd>-</kbd>
3. 调整当前活动窗口大小：<kbd>alt</kbd>+<kbd>shift</kbd>+<kbd>方向键</kbd>

### 添加 Git Bash

找到你的 Git Bash 目录，比如我的目录：`C:\Software\xxx\vendor\git-for-windows`

打开 Windows Terminal 的 `setting.json` 文件（就是头部栏向下箭头里的"设置"）添加以下内容

```json
{
  "profiles": {
    "list": {
      {   // Git Bash setting
        "guid": "{0000aabb-ccdd-ee23-eezv1-uizc2o123456}", // Guid 不与其他程序重复即可
        "commandline": "C:\\Software\\xxx\\vendor\\git-for-windows\\bin\\bash.exe",
        "icon": "C:\\Software\\xxx\\vendor\\git-for-windows\\gwindows_logo.png",
        "hidden": false,
        "name": "Bash", // 名称
        "startingDirectory": "C:\\Users\\uphg", // 用户目录
        "colorScheme": "Chester", // 主题设置
        "fontSize": 12 // 字体大小
      },
    }
  }
}
```

> Guid 可以在此处生成：[在线生成Guid](https://www.guidgenerator.com/online-guid-generator.aspx)

推荐一个主题配置

```json
{
  "schemes": [
    {
      "name": "Chester",
      "black": "#080200",
      "red": "#fa5e5b",
      "green": "#16c98d",
      "yellow": "#ffc83f",
      "blue": "#288ad6",
      "purple": "#d34590",
      "cyan": "#28ddde",
      "white": "#e7e7e7",
      "brightBlack": "#6f6b68",
      "brightRed": "#fa5e5b",
      "brightGreen": "#16c98d",
      "brightYellow": "#feef6d",
      "brightBlue": "#278ad6",
      "brightPurple": "#d34590",
      "brightCyan": "#27dede",
      "brightWhite": "#ffffff",
      "background": "#2c3643",
      "foreground": "#ffffff",
      "selectionBackground": "#67747c",
      "cursorColor": "#b4b1b1"
    }
  ]
}
```

设置默认打开的命令行程序

```json
{ // 此处配置的是你需要默认启动的程序的 Guid
  "defaultProfile": "{0000aabb-ccdd-ee23-eezv1-uizc2o123456}"
}
```

### 参考文章

- [官方应用商店](https://www.microsoft.com/zh-cn/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab)
- [GitHub](https://github.com/microsoft/terminal)
- [皮肤样式参考](https://windowsterminalthemes.dev/)
- [皮肤添加教程](https://docs.microsoft.com/zh-cn/windows/terminal/customize-settings/color-schemes)
- [快捷键使用教程](https://docs.microsoft.com/zh-cn/windows/terminal/panes)
- [在线生成Guid](https://www.guidgenerator.com/online-guid-generator.aspx)
- [Adding Git-Bash to the new Windows Terminal](https://stackoverflow.com/questions/56839307/adding-git-bash-to-the-new-windows-terminal)
- [将 Git-bash 置入 Windows Terminal](https://blog.yasol.cn/post/33)

## Xshell6

我的配色方案，点击<a :href="$withBase('/file/Andromeda.xcs')">下载文件</a>

```
[Andromeda]
text=e5e5e5
cyan(bold)=22bbdd
text(bold)=666666
magenta=745be8
green=dba500
green(bold)=ffca28
background=262a33
cyan=167d94
red(bold)=f0266f
yellow=038353
magenta(bold)=a292ef
yellow(bold)=05bc79
red=c90e50
white=cfd8d3
blue(bold)=4b73a2
white(bold)=eceeee
black=36342e
blue=365274
black(bold)=535755
[Names]
name0=Andromeda
count=1
```


## 粘贴板工具

一款粘贴极其方便的工具，设置快捷键后可以弹出直接选择粘贴。

谷歌搜索：clipboardfusion

官网下载：https://www.clipboardfusion.com/Download/

可以在设置中设置快速打开快捷键，如图

![tool](/images/clipboardfusion_01.png)

## 截图工具 

功能与QQ微信自带的截图基本相同，但是优点就是即使没有 QQ微信 的时候也可以使用

谷歌搜索：Snipaste 

官网下载：https://zh.snipaste.com/download.html

可以在设置中设置颜色值复制方式，如图：

![tool](/images/snipaste_01.png)

## 文件搜索工具

注意安装后在设置中授予，如图：

![tool](/images/Everything-1-4-1.jpg)

搜索：Everything

官网下载：https://www.voidtools.com/zh-cn/

可以搜索电脑中的所有目录