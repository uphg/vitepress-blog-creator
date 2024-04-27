---
title: Stream 入门
date: 2021-11-14T12:49:31+08:00
tags:
  - Node.js
  - Stream
---

本文案例使用 Node.js 应用 Stream

本文案例代码：[https://github.com/uphg/stream-demo](https://github.com/uphg/stream-demo)

## 概念图

![Stream 流示例](/images/stream-demo.png)

- stream 是水流，默认没有水
- stream.write 可以让水流中有水（数据）
- 每次写入的小数据叫做 chunk（块）
- 产生数据的一段叫做 source（源头）
- 得到数据的一段叫做 sink（水池）

## 基本用法

**使用 Stream 写入内容**

```js
const fs = require('fs')
const stream = fs.createWriteStream('./big_file.txt') // 创建一个 Stream

for (let i = 0; i < 1000000; i++) {
  stream.write(`这是第 ${i} 行内容，我们需要很多很多内容，要不停地写文件噢噢噢噢噢噢回车\n`)
}

stream.end() // 关掉 Stream
console.log('done')
```

> 上面代码的运行方式：打开一个流，多次添加内容，关闭流（每次添加都是在上一次的流中追加）

**使用 Node.js 服务器访问该文件**

```js
const fs = require('fs')
const http = require('http')
const server = http.createServer()

server.on('request', (request, response) => {
  fs.readFile('./big_file.txt', (error, data) => {
    if (error) throw error
    response.end(data)
    console.log('done')
  })
})

server.listen(8888)
```

运行 `curl http://localhost:8888/` 访问该端口，然后打开任务管理器，会发现 Node.js 占用了 110MB 左右的内存，直到文件访问完成后才会结束占用。 

**使用 Stream 改写上面的例子**

用 Stream 读取该文件

```js
const http = require('http')
const fs = require('fs')
const server = http.createServer()

server.on('request', (request, response) => {
  const stream = fs.createReadStream('./big_file.txt')
  stream.pipe(response)
})

server.listen(8888)
```

再次运行 `curl http://localhost:8888/` 访问该端口，这时查看 Node.js 内存占用，基本在 30MB 左右。这就是使用 Stream（流）的效果。

## 管道

`stream.pipe(response)` 表示 将 stream 读到的文件通过管道连接到 response 响应体中。

![pipe 管道示例图](/images/stream-pipe-demo.png)

- 两个流可以用一个管道相连
- stream1 的末尾连上 stream2 的开头
- 只要 stream1 有数据，就会流到 stream2

代码

```js
stream1.pipe(stream2)

// 链式操作
a.pipe(b).pipe(c)
```

**管道可以通过事件监听实现**，我们可以使用事件监听实现 pipe API

```js
// data 事件，传输一段 chunk 时触发，一有数据就塞给 stream2
stream1.on('data', (chunk) => {
  stream2.write(chunk)
})

// end 事件，表示数据传输结束，停掉 stream2
stream1.on('end', () => {
  stream2.end()
})
```

## Stream 对象的原型链

创建一个

```js
const fs = require('fs')
const stream = require('stream')
const events = require('events')
const s = fs.createReadStream('big_file.txt')
```

运行以下命令在浏览器调试窗口中查看 log

```sh
node --inspect-brk demo.js
```

**`s = fs.createReadStream(path)`（读取文件）的原型链**

1. 自身属性（由 `fs.ReadStream` 构造）
2. 第一层原型：`Readable.prototype`
3. 第二层原型：`Stream.prototype`
4. 第三层原型：`EventEmitter.prototype`
5. 第四层原型：`Object.prototype`

> 上面的原型链表示 Stream 对象都继承了 EventEmitter 也就是事件发布订阅

## Readable Stream

- 事件
  - **data**
  - **end**
  - error
  - close
  - readable
- 方法
  - pipe() unpipe()
  - wrap()
  - destroy()
  - read()
  - unshift()
  - resume() pause()
  - isPaused()
  - setEncoding()

### 静止态 paused 和流动态 flowing

- 默认处于 paused 态
- 添加 data 事件监听，它就变为 flowing 态
- 删除 data 事件监听，它就变为 paused 态
- 使用 `pause()` 可以将它变为 paused 态
- 使用 `resume()` 可以将它变为 flowing 态

状态示例

```js
const http = require('http')
const fs = require('fs')
const server = http.createServer()
server.on('request', (request, response) => {
  const stream =
    fs.createReadStream('./big_file.txt') // --> 默认 paused

  stream.pipe(response) // --> 变为 flowing
  stream.pause()        // --> 变为 paused
  setTimeout(() => {
    stream.resume()     // --> 变为 flowing
  }, 3000)

})
```

## Writable Stream

- 事件
  - **drain**
  - **finish**
  - error
  - close
  - pipe
  - unpipe
- 方法
  - write()
  - destroy()
  - end()
  - cork() uncork()
  - setDefaultEncoding()

### drain 事件（流干、耗尽）

- 该事件表示可以继续 write（写）内容了
- 我们调用 `stream.write(chunk)` 的时候，可能会得到 `false` 状态
- `false` 的意思的你写的太快了，数据积压了（堵塞了）。
- 这时候我们就不能再 write 了，需要监听 drain
- 等到 drain 事件触发了，我们才能继续 write

[数据积压示例代码](https://nodejs.org/api/stream.html#stream_event_drain)

```js
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Last time!
        writer.write(data, encoding, callback);
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
        if (ok === false) {
          console.log('堵塞了，不能再写了')
        }
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Had to stop early!
      // Write some more once it drains.
      writer.once('drain', () => {
        console.log('水流干了')
        write()
      });
    }
  }
}

const writer = fs.createWriteStream('./big_file.txt')
writeOneMillionTimes(writer, 'Hello World!')
```

运行上面的代码后，会发现打出了很多次 '堵塞了，不能再写了'、'水流干了' 的 log，这表明我们文件写入的太快了，在不超过 1 毫秒内就想把 1000000 次的 'Hello Wrold!' 写入，所以导致了很多次数据积压，只能监听 drain 事件来执行继续写入。

### finish 事件

在调用 `stream.end()` 之后，而且缓冲区数据都已经传给底层系统之后，触发 finish 事件。


## 创建 Writable Stream

创建一个可写流

```js
const { Writable } = require('stream')

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString())
    callback()
  }
})

process.stdin.pipe(outStream)
// 上面相当于运行以下代码
// process.stdin.on('data', (chunk) => {
//   outStream.write(chunk)
// })
```

## 创建 Readable Stream

创建一个可读流

```js
const { Readable } = require('stream')

const inStream = new Readable({
  read(size) {
    const char = String.fromCharCode(this.currentCharCode++)
    this.push(char)
    console.log(`推了 ${char}`)
    if (this.currentCharCode > 90) { // Z 的字符编码为 90
      this.push(null); // 数据推完了
    }
  }
})

inStream.currentCharCode = 65
inStream.pipe(process.stdout) // 每次读数据都输出
// 这次数据是按需供给的，对方调用 read 我们才会给一次数据
```

## 创建 Duplex Stream

创建一个可读可写流

```js
const { Duplex } = require('stream')

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    console.log(chunk.toString())
    callback()
  },
  read(size) {
    const char = String.fromCharCode(this.currentCharCode++)
    this.push(char)
    if (this.currentCharCode > 90) { // Z 的字符编码为 90
      this.push(null); // 数据推完了
    }
  }
})

inoutStream.currentCharCode = 65
process.stdin.pipe(inoutStream).pipe(process.stdout)
```

## 创建 Transform Stream

创建一个转换流，可以将小写字母转为大写字母输出

```js
const { Transform } = require('stream')

const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
})

// 将输入使用 upperCaseTr 转换为大写，并且输出
process.stdin.pipe(upperCaseTr).pipe(process.stdout)
```

## 内置的 Transform Stream

使用 gzip 压缩文件

```js
// 根据输入文件路径 使用 gzip 压缩指定文件
const fs = require('fs')
const zlib = require('zlib')
const filePath = process.argv[2]

fs.createReadStream(filePath)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(filePath + '.gz'))
```

使用 crypto 模块加密 gzip 文件

```js
// 使用 crypto 模块加密 gzip 文件
const fs = require('fs')
const zlib = require('zlib')
const filePath = process.argv[2]
const crypto = require('crypto')
const { Transform } = require('stream')
const { Buffer } = require('buffer')

const PASSWORD = 'ExchangePasswordPasswordExchange'
const iv = Buffer.from(crypto.randomBytes(8))
ivString = iv.toString('hex')

// 每次 chunk 打出一个 .
const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.')
    callback(null, chunk)
  }
})

fs.createReadStream(filePath)
  .pipe(crypto.createCipheriv('aes-256-cbc', PASSWORD, ivString)) // 一定要先加密，再 gzip 压缩
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(filePath + '.gz'))
  .on('finish', () => console.log('\nDone'))
```

## [数据流中的积压问题](https://nodejs.org/zh-cn/docs/guides/backpressuring-in-streams/)

- 处理数据流的时候经常会遇到数据过多产生阻塞
- 比如有时 `Readable` 传输给 `Writable` 的速度远大于它接受和处理的速度
- 发生这种情况时，传输过快的数据会积压起来，直到整个流程全部处理完毕
- `highWaterMark` 就是高水位线，表明了流的缓冲的容量
- 一旦内部的可读缓冲的总大小达到 `highWaterMark` 指定的阈值时，流会暂时停止读取数据，直到当前缓冲的数据被消费。

