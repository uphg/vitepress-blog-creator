---
title: 子进程
date: 2021-11-27T20:53:45+08:00
tags:
  - Process
---

进程的概念，以及在 Node.js 中使用进程

## 进程 Process

**举例**

- NotePad.exe 是一个程序，不是进程
- 双击 NotePad.exe 时，操作系统会开启一个进程

**定义**

- 进程是程序的执行实例
- 程序在 CPU 上执行时的活动叫进程
- 实际上进程并没有明确定义，只要符合一些的规则即可

**特点**

- 一个进程可以创建另一个进程（父进程与子进程）
- 通过任务管理器可以很直观的看到每个进程

## 了解 CPU

**特点**

- 一个单核 CPU，在一个时刻，只能做一件事情
- 那么如何让用户同时执行看电影、听声音、写代码的操作呢？
- 答案是在不同进程之间快速切换，由于进程的切换速度非常快，所以人可能感知不到

**多程序并发执行**

- 指多个程序在宏观上并行，微观上串行
- 每个进程会出现 执行 - 暂停 - 执行 的规律
- 多个进程之间会出现抢占资源（如打印机在打印文件时）的现象

## 阻塞进程

- 阻塞与就绪都是非运行状态
- 如 A 进程在等待 CPU 资源，另一个 B 进程在等待 I/O 完成（如文件读取）
- 如果这个时候把 CPU 分配给 B 进程，B 还是在等待 I/O，这时候 B 进程就叫做阻塞进程
- 因此，分派程序只会把 CPU 分配给非阻塞进程

运行流程

![进程 - 运行流程](/images/process-running-process.jpg)

创建流程

![进程 - 创建流程](/images/process-creation-process.jpg)

## 线程 Thread 的引入

**线程是阶段性引入的**

- 在面向进程设计的系统中，进程是程序的基本执行实体
- 在面向线程设计的系统中，进程本身不是基本运行单位，而是线程的容器

**引入原因**

- 进程执行的是基本实体，也是资源分配的基本实体
- 导致进程的创建、切换、销毁太消耗 CPU 时间了
- 于是引入线程，线程作为执行的基本实体
- 而进程只作为资源分配的基本实体
- 此处可以以设计师和工程师分开招聘为例

## 线程 Thread

**概念**

- CPU 调度和执行的最小单元
- 一个进程中至少有一个线程，可以有多个线程
- 一个进程中的线程共享该进程的所有资源
- 进程的第一个线程叫做初始化线程（初始化线程可以开启子线程）
- 线程的调度可以由操作系统负责，也可以由用户自己负责

**例子**

- 浏览器进程里面由渲染引擎、V8引擎、存储模块、网络模块、用户界面模块等
- 每个模块都可以放在一个线程里

**子进程与线程**

进程可以创建子进程，也可以创建线程，但默认情况下以创建线程为优先，除非该模块需要独立的资源分配功能。

## child_process

`child_process` 是 Node.js 创建子进程的一个模块

## exec

语法

```js
child_process.exec(command[, options][, callback])
```

exec 是 execute 的缩写，用于执行 bash 命令

- cmd：运行的命令
- options：选项
- 回调函数：`(error, stdout, stderr) => {}`

### 基础用法

```js
const { exec } = require('child_process');

exec('cat demo1.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: \n${stdout}`);
  console.error(`stderr: \n${stderr}`);
})
```

### 运行程序

它还可以根据程序路径来运行程序

```js
const { exec } = require('child_process');

const programPath = 'C:\\Software\\Bandizip\\Bandizip.exe'

exec(programPath, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: \n${stdout}`);
  console.error(`stderr: \n${stderr}`);
})
```

### execSync

exec 的同步版本

```js
const { execSync } = require('child_process');

const result = execSync('cat demo1.js')

console.log(`result:\n${result}`)
```

### 返回值

也可以通过返回值的方式处理它的数据

```js
const { exec } = require('child_process');

const ls = exec('ls -l ../')

ls.stdout.on('data', (chunk) => {
  console.log(`chunk：\n${chunk}`)
})

ls.stderr.on('data', (error) => {
  console.log(`error：\n${error}`)
})
```

### 封装为 Promise 对象

可以使用 `util.promisify()` 封装为 Promise

```js
const util = require('util')
const { exec } = require('child_process');

const exec2 = util.promisify(exec)

exec2('ls -l ../').then(({ stdout, stderr }) => {
  console.log(`stdout: \n${stdout}`);
  console.error(`stderr: \n${stderr}`);
})
```

**尽量不要使用 exec**

由于 exec 会执行命令，所以如果用户恶意注入代码，也有可能会执行，如下

```js
const { exec } = require('child_process');

const userInput = '. && cat demo1.js'

exec(`ls ${userInput}`, (error, stdout) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: \n${stdout}`);
})
```

上面代码 `userInput` 变量中的命令就被执行了。所以，尽量使用 execFile 代替 exec

## execFile

语法

```js
child_process.execFile(file[, args][, options][, callback])
```

相比于 exec ，execFile 会将命令的参数转换为数组组成的参数，所以无法注入恶意命令

```js
const { execFile } = require('child_process');

const userInput = '.'

execFile(`ls`, ['-la', userInput], (error, stdout) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: \n${stdout}`);
})
```

### options

常用的选项（该参数 exec 与 execFile 通用）

- cwd：当前命令执行的目录
- env：环境变量
- shell：用什么 shell 执行（shell 的路径）
- maxBuffer：最大缓存，默认 1024 * 1024 字节（用于存储运行结果的最大内存）

使用示例

```js
const { execFile } = require('child_process')

const options = {
  cwd: 'C:\\'
}

execFile(`ls`, ['-la', '.'], options, (error, stdout) => {
  console.log(`stdout: \n${stdout}`);
})
```

## spawn

- 用法与 execFile 方法类似
- 没有回调函数，只能通过流事件获取结果
- 没有最大 200kb 的限制（因为是流）

基本示例

```js
const { spawn } = require('child_process');

const ls = spawn(`ls`, ['-la', '.'])

ls.stdout.on('data', (chunk) => {
  console.log(`chunk：\n${chunk}`)
})
```

**能用 spawn 的时候就不要用 execFile，spawn 的限制更少**

## fork

- 创建一个子进程，执行 Node 脚本
- `fork('./child.js')` 相当于 `spawn('node', ['./child.js'])`
- 会多出一个 message 事件，用于父子通信
- 会多出一个 send 方法

**子进程给父进程传值**

```js
// n.js
const { fork } = require('child_process');

const n = fork('./child.js')

n.on('message', function(msg) {
  console.log('父进程得到值')
  console.log(msg)
})

// child.js
setTimeout(() => {
  process.send({ foo: 'bar' })
}, 2000)
```

**父进程给子进程传值**

```js
// n.js
const { fork } = require('child_process');

const n = fork('./child.js')

n.send({ hello: 'world' })

// child.js
process.on('message', (data) => {
  console.log('子进程得到值')
  console.log(data)
})
```

> 使用此方法父进程给子进程传值会导致 Node 一直在等待状态

**能使用 fork 时尽量使用 fork，因为我们执行的大部分是 Node 脚本**

## 创建线程

**不推荐使用**

- 由于 `child_process.exec()` 是在 Node.js v0.1.90 加入的，而 `new Worker()` 类是在 Node.js v10.5.0 加入的。v0.1.90 版本是 	2011年8月26日发布的，而 v10.5.0 是2018年6月20日，发布的，导致 `new Worker()` 这个 API 太新了，很多库都没有使用它。
- 官方不推荐使用该方法，原文：工作线程对于执行 CPU 密集型的 JavaScript 操作很有用。 它们对 I/O 密集型的工作帮助不大。 Node.js 内置的异步 I/O 操作比工作线程更高效。

## Worker

常用 API

- `isMainThread`
- `new Worker(fileName)`
- `parentPort`
- `postMessage`

事件

- message：线程间发送消息
- exit：线程因为意外情况中断时执行

**worker.isMainThread**

判断是否在线程内 isMainThread，如果此代码不在 Worker 线程（主线程）内运行，则为 `true`。

```js
const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  // 主线程
  // 这会在工作线程实例中重新加载当前文件。
  new Worker(__filename);
} else {
  console.log('内部线程');
  console.log(isMainThread);  // 打印 'false'。
}
```

**worker.parentPort**

使用 parentPort 让主线程与子线程通信

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const child = new Worker(__filename);
  child.once('message', (message) => {
    console.log(message);  // 打印 'Hello, world!'。
  });
  child.postMessage('Hello, world!');
} else {
  // 当收到来自父线程的消息时，则将其发回：
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```