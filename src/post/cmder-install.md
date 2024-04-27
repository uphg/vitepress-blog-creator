---
title: 环境搭建 - Cmder 配置
tags:
  - 命令行
categories:
  - 教程
date: 2019-08-08 22:31:32
---

尽量使用完整版 Cmder，这样配置起来更方便。

<!-- more -->

## 注意

- 如果安装了浏览器FQ插件（如 Proxy SwitchyOmega）尽量使用FQ下载。
- 如果安装电脑中前已经有 Git Bash 直接下载安装简化版即可，此教程不包括简化版安装教程。

## 下载

- 官网链接：https://cmder.net/
- 下载后尽量解压到一个非中文无空格路径下的目录
- 选择完整版下载
  ![cmder](/images/cmder_29.png)

## 配置

1. 首先解压文件 (最好放在一个没有空格的目录)，解压后打开

2. 在命令行底部右键菜单栏，选择第三个选项，如图：

  ![cmder](/images/cmder_24.png)
   
3. 配置语言等选项 (此处语言选项可能重启后失效，如果失效需要修改配置文件)，如图：

  ![cmder](/images/cmder_19.png)
   
4. 然后配置窗口比例，这里如果高度配置百分比保存后重新打开无效可以设置为像素，如图：

  ![cmder](/images/cmder_20.png)

5. 配置失去焦点自动隐藏，如图：

  ![cmder](/images/cmder_22.png)

6. 配置启动程序的默认命令行，即为 Git Bash 如图：

  ![cmder](/images/cmder_23.png)

::: details 假如 Cmder 配置语言后再次打开发现语言还是英文，就需要修改配置文件

打开设置，选择导出，如图：

![cmder](/images/cmder_25.png)
  
选择那个 ConEmu.xml 文件，如图：

![cmder](/images/cmder_26.png)
  
然后在文件中查找 language 将其中 data 的属性改为 zh 如图：

![cmder](/images/cmder_27.png)

:::

## 配置 VSCode

1. 在 VSCode 中 `Ctrl + Shift + P` 打开命令 搜索 settings
2. 选择 打开设置 (json)
3. 在 VSCode 中添加如下配置（path 需要替换为你的 Git Bash 的路径）
  ```sh
  "terminal.integrated.profiles.windows": {
    "Git-Bash": {
      "path": ["C:\\xxx\\cmder\\vendor\\git-for-windows\\bin\\bash.exe"],
    },
  },
  "terminal.integrated.defaultProfile.windows": "Git-Bash",
  ```

## 快捷键

### 设置分屏

在设置中选择 `按键 & 宏` 一栏在其中的搜索框中搜索 分屏 然后设置 复制分屏至底部和复制分屏至右侧的快捷键，如图：

![cmder](/images/cmder_28.png)

设置之后就可以使用快捷键分屏了

强制关闭当前窗口：`Ctrl + W`

## 配置右键菜单

#### 第一步，配置环境变量
1. 找到 Cmder 的存放目录，记住该目录（如：`C:\Software\cmder`）。
2. 右键点击我的电脑 --> 属性 --> 高级系统设置 --> 环境变量 --> 系统变量。
3. 点击新建，变量名设置为 `CMDER_HOME`，变量值粘贴 Cmder 的存放目录。
4. 点击系统变量中的 Path，然后在新窗口中点击新建，输入 `%CMDER_HOME%`。
5. 至此，环境变量配置完成，一路点击确定关闭即可。

#### 第二步，添加 Cmder 到右键菜单
1. Windows 10 系统下右键点击开始（屏幕左下角的图标“田”），选择 Windows PowerShell（管理员），在管理员权限的终端输入以下语句：
    ```sh
    Cmder.exe /REGISTER ALL
    ```
2. 到此，即可使用右键菜单打开 Cmder

## 添加主题

在设置的 特征 --> 颜色 中，随便修改一个主题的名字并保存，它就会生成一个新的自定义主题，在 `ConEmu.xml` 中搜索并替换该主题的配置为你想要的配置即可。

我自己的主题配色：

```xml
<key name="Palette1" modified="2021-03-09 13:42:06" build="180626">
  <value name="Name" type="string" data="Chester"/>
  <value name="TextColorIdx" type="hex" data="10"/>
  <value name="BackColorIdx" type="hex" data="10"/>
  <value name="PopTextColorIdx" type="hex" data="10"/>
  <value name="PopBackColorIdx" type="hex" data="10"/>
  <value name="ColorTable00" type="dword" data="00453830"/>
  <value name="ColorTable01" type="dword" data="00b17f66"/>
  <value name="ColorTable02" type="dword" data="008dc916"/>
  <value name="ColorTable03" type="dword" data="00d68a28"/>
  <value name="ColorTable04" type="dword" data="006a61bf"/>
  <value name="ColorTable05" type="dword" data="00eca6ca"/>
  <value name="ColorTable06" type="dword" data="003fc8ff"/>
  <value name="ColorTable07" type="dword" data="00e6d4d0"/>
  <value name="ColorTable08" type="dword" data="00b09788"/>
  <value name="ColorTable09" type="dword" data="00e7ab77"/>
  <value name="ColorTable10" type="dword" data="009aca8f"/>
  <value name="ColorTable11" type="dword" data="00c0c67b"/>
  <value name="ColorTable12" type="dword" data="009491e3"/>
  <value name="ColorTable13" type="dword" data="007c79db"/>
  <value name="ColorTable14" type="dword" data="00a3d7dd"/>
  <value name="ColorTable15" type="dword" data="00e6d4d0"/>
</key>
```

## 参考文章

- [ConEmu-Color-Themes](https://github.com/joonro/ConEmu-Color-Themes)
- [将 Cmder 添加到右键菜单](https://zhuanlan.zhihu.com/p/51061493)
