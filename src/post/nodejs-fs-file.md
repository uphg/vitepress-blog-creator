---
title: 文件模块
---

## commander.js

Node.js 命令行操作符库，用于执行各种拓展操作符。[官网地址](https://github.com/tj/commander.js)

安装

```sh
yarn add commander
#or npm install commander
```

使用

```js
const program = require('commander')

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);
```

运行

```sh
λ node index -h
Usage: index [options]

Options:
  -d, --debug              output extra debugging
  -s, --small              small pizza size
  -p, --pizza-type <type>  flavour of pizza
  -h, --help               display help for command
```

## inquirer.js

Node.js 命令行选择操作库，便于执行下一步操作，[官网](https://github.com/SBoudrias/Inquirer.js/)

安装

```shell script
yarn add inquirer
# or npm install inquirer
```

使用

```js
const inquirer = require('inquirer');
inquirer
  .prompt([
    /* Pass your questions in here */
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
```

官方案例：[packages/inquirer/examples/](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples)

## 向 npm 提交脚本包

1. 修改 `package.json` 的 `name`、`bin`、`files`，示例

  bin 表示你要运行脚本的根目录

  files 表示需要提交的重要文件

  ```json
  {
    "name": "toup",
    "bin": {
      "t": "cli.js"
    },
    "files": [
      "*.js"
    ],
    "version": "0.0.3",
    "main": "index.js",
    "license": "MIT",
    "dependencies": {
      "commander": "^3.0.2",
      "inquirer": "^8.0.0"
    }
  }
  ```

2. 添加 shebang，让它变成可执行文件（搜索 node shebang 了解详情）

  ```sh
  #!/usr/bin/env node
  ...bash
  ```

3. 将你要运行的脚本变成可执行文件，运行以下命令（在 linux 及 mac 系统下起作用）

  ```sh
  chmod +x cli.js
  ```
4. 运行 `npm adduser` 登录的你 npm 账号

5. 如果需要更新包，修改版 `package.json` 本号，然后继续运行

  ```sh
  npm publish
  ```

## 添加单元测试

安装 Jest 库，[官网](https://jestjs.io/zh-Hans/)

```sh
yarn add --dev jest
#or npm install --save-dev jest
```

文件/目录，命名规定

```
.
├─ __mocks__       # mock 数据，也可以模拟 Node.js 常用操作
│  ├─ one.js
│  └─ two.js
├─ __tests__       # 单元测试存放文件
│  ├─ one.spec.js  # 单元测试默认后缀 *.spec.js
│  └─ two.spec.js
├─ index.js
└─ package.json
```

使用 Jest 模拟 Node.js 模块

```js
const fs = jest.genMockFromModule('fs') // 使用 jest mock 一个 fs 模块
const _fs = jest.requireActual('fs') // 引用真正的 fs 模块
```

验证对象类型数据是否相同

```js
describe('Object', ()=>{
  it('isArray', async ()=>{
    const list = [{title: 'hi', done: true}]
    const data = [{title: 'hi', done: true}]
    expect(list).toStrictEqual(data) // 判断两个对象是否相同
  })
})
```

验证是否为函数

```js
describe('Object', ()=>{
  it('isFunction', ()=>{
    expect(db.read instanceof Function).toBe(true)
  })
})
```

## Node.js 调试

在命令行运行

```sh
node --inspect-brk t add task1
```

其中 `-brk` 表示等待添加 debugger 后运行

运行命令后在浏览器控制台打开带有 Node.js 图标的控制台即可