---
title: WebStorm 配置
---

## 设置自动格式化代码快捷键

1. 按两下 shift
2. 在弹出框中搜索：`Reformat`
3. 其中第一项 `Reformat Code` 就是你自动格式化代码的快捷键

## 配置 JS 代码自动加分号

1. 打开 Setting > Editor > Code Style > JavaScript > Puntuation
2. 选择 semicolon to terminate statements 后的 always 选项

## 自动引入与自动添加变量

搜索 `Show Context Actions`，查看你的快捷键

新建一个 `*.ts` 文件，添加以下内容

```js
http.createServer()
```

鼠标选中 http 点击 `Alt + Enter`，选择 `Introduce local variable`


## 智能补全代码

搜索：`Complete Current Statement`，查看你的快捷键

当你输入 `if(true)`，按下 `Ctrl + Shift + Enter` 即可补全为 `if(true){ }`，它还会自动格式化代码。

## 配置 git

打开 Setting > Version Control > Git，在 Path to Git executable 中添加如下示例配置

```
C:\xxx\cmder\vendor\git-for-windows\bin\git.exe
```

## 配置 bash 命令行

打开 Setting > Tools > Terminal，在 Shell path 中添加如下示例配置

```
C:\xxx\cmder\vendor\git-for-windows\bin\bash.exe
```

## 设置指定文件夹为项目根目录

![webstorm-resource-root](/images/webstorm-resource-root.png)

可以使引用项目中的图片或其他路径标签时 WebStorm 不提示错误，示例：

```html
<img src="/images/404.png"  alt="404"/>
```

## 配置代码格式化

设置 `import { demo } from 'demo'` 中 `{}` 左右的空格

![import space](/images/setting-import-curly-braces-about-space.png)

## 配置文件未保存标识

如图

![file save state](/images/webstorm-file-save-state.png)

## 设置标签换行后内容没有tab

设置前

```vue
<script>
  export default {
    name: 'Demo'
  }
</script>
```

设置后

```vue
<script>
export default {
  name: 'Demo'
}
</script>
```

配置示例

![WebStorm Setting](/images/webstorm-label-tab.jpg)

## 自动引入当前项目的 ESLint

配置示例

![WebStorm Setting](/images/webstorm-import-eslint.jpg)

## 添加 Vue 项目中 Webpack 配置路径，识别 @ 符

![WebStorm Setting](/images/webstorm-vue-webpack.jpg)


## 设置当前项目根据 ESLint 保存时自动格式化

图示

![WebStorm Setting](/images/webstorm-setting-eslint.jpg)