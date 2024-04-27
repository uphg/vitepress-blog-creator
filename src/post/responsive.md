---
title: Vue 数据响应式原理（2.x）
date: 2020-11-28T14:05:00+08:00

tags:
  - Vue
---

在理解 Vue 数据响应式之前，首先要理解一些 ES6 之后的新语法，如 `getter`、`setter`、`Object.defineProperty()`。

## getter

可以给对象的属性设置获取时的值，通过函数 return 的方式返回。

```js
let object = {
  姓: '张',
  名: '三',
  get 姓名() {
    return this.姓 + this.名
  }
}
console.log(object.姓名) // 张三
```

## setter

可以给对象的属性设置一个修改该属性时所做的操作，依然是一个函数，函数的第一个参数就是修改时赋给该属性的新值。

```js
let object = {
  姓: '张',
  名: '三',
  set 姓名(value) {
    this.姓 = value[0]
    this.名 = value.substring(1)
  }
}
object.姓名 = '李四'
console.log(object.姓) // 李
console.log(object.名) // 四
```

## getter + setter

通常情况下，我们习惯将两个属性结合起来使用，如下：

```js
let object = {
  姓: '张',
  名: '三',
  get 姓名() {
    return this.姓 + this.名
  },
  set 姓名(value) {
    this.姓 = value[0]
    this.名 = value.substring(1)
  }
}
object.姓名 = '王五'
console.log(object.姓名)
```

## `Object.defineProperty()`

有时候在声明对象后，又想给对象添加一个带有 getter 和 setter 的值。这时候就需要使用 `Object.defineProperty()`

它接受三个参数，第一个是要添加的对象，第二个是要添加的对象的属性，第三个是由 getter 和 setter 两个属性组成的对象（注：此处的 getter 和 setter 后不需要再加属性名），示例：

```js
let object = { name: '张三' }
let _email = '123@xx.com'
Object.defineProperty(object, 'email', {
  get() {
    return _email
  },
  set(value) {
    _email = value
  }
})
console.log(object.email) // 123@xx.com
object.email = '5885653362@qq.com'
console.log(object.email) // 5885653362@qq.com
```

上面的代码还有一个缺陷，就是每次都要再次声明一个变量 `_email` 来存储真实 `email` 的值，我们可以通过以下的代理函数来解决这个问题。

## `Object.defineProperty` 实现代理

**假如要实现一个限制输入的数字不能小于 0 的需求**

我们可以封装如下函数

```js
let data = proxy({ data: {n: 0}}) // 生成一个匿名对象，外部无法访问
// 将 data 解构赋值，传入函数
function proxy({data}) {
  const object = {}
  // 使用 defineProperty 代理 data 中的每一个属性
  // 此处应该是循环遍历对象的每一个属性，为了简化代码暂时省略。
  Object.defineProperty(object, 'n', {
    get() {
      return data.n
    },
    set(value) {
      if(value < 0) return
      data.n = value
    }
  })
  return object
}

// 此时设置 data 的值
data.n = -1
console.log(data.n) // 修改失败，返回 0
data.n = 1
console.log(data.n) // 修改成功，返回 1
```

但是如果传入一个命名对象，那么还是可以修改 `data` 的属性为 `-1`，如下

```js
let myData = {n: 0}
let data = proxy({ data: myData })

console.log(data.n) // 0
myData.n = -1
console.log(data.n) // -1
```

这时候就要实现一个即使传入命名对象，也可以限制该对象的属性。只要在原有的代码上添加对原对象也使用 `Object.defineProperty` 代理，该代理会直接覆盖对象的默认属性的 getter 和 setter

```js{5-15}
let myData = {n: 0}
let data = proxy({ data: myData })

function proxy({data}) {
  let value = data.n
  delete data.n // 此行可以删掉，因为通过 defineProperty 设置属性时会覆盖存在的值
  Object.defineProperty(data, 'n', {
    get() {
      return value
    },
    set(newValue) {
      if (newValue < 0) return
      value = newValue
    }
  })

  const object = {}
  Object.defineProperty(object, 'n', {
    get() {
      return data.n
    },
    set(value) {
      if (value < 0) return // 此行可以删掉，因为上面已经做了一次判断进行限制
      data.n = value
    }
  })

  return object
}
```

## 总结

Vue 数据响应式实现的原理，基本上就是 通过 `Object.defineProperty` 的 `getter` 和 `setter` 劫持数据。并拷贝一个数据实现的。
