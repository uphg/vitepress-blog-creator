---
title: Vue 计算属性和监听器
date: 2020-11-25T22:07:22+08:00

tags:
  - Vue
  - computed
  - watch
---

## 计算属性（computed）

### 基础用法

```js
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}
```

### 添加 getter & setter

```js
computed: {
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

**动态改变用户信息**

假如要动态显示一个用户的信息，如果用户的 nickname 不存在，就显示 email。如果 email 不存在，就显示 phone。可以用 computed 添加一个计算属性，如下：

```js
data() {
  return {
    user: {
      nickname: '方方',
      email: '123@qq.com',
      phone: '12345'
    }
  }
},
computed: {
  displayName: {
    get() {
      const user = this.user
      return user.nickname || user.email || user.phone
    },
    set(value) {
      this.user.nickname = value
    }
  }
}
```

这样每次修改 `displayName` 修改的都是 `user.nickname`， 而获取时是根据 `nickname`、`email`、`phone` 依次判断获取。

**根据性别筛选用户列表**

假设用户信息用以下方式存储

```js
const userList = [
  { id: 1, name: '张三', gender: '男' },
  { id: 2, name: '李四', gender: '女' },
  { id: 3, name: '王五', gender: '男' },
  { id: 4, name: '陈六', gender: '女' }
]
```

使用 `computed` 来筛选其中的性别。只需要添加一个性别属性 `gender` 然后在 computed 中添加 displayList 计算属性，该属性根据 `gender` 的值改变：

```js
data() {
  return {
    userList: [
      { id: 1, name: '张三', gender: '男' },
      { id: 2, name: '李四', gender: '女' },
      { id: 3, name: '王五', gender: '男' },
      { id: 4, name: '陈六', gender: '女' }
    ],
    gender: ''
  }
},
computed: {
  displayList() {
    const hash = {
      male: '男',
      female: '女'
    }
    const { gender, userList } = this
    if (gender === '') {
      return userList
    } else if (typeof gender === 'string') {
      return userList.filter(user => user.gender === hash[gender])
    }
  }
}
```

那么每次筛选时只需要改变 `gender` 的值即可：

```vue
<template>
  <div>
    <button @click="gender = ''">全部</button>
    <button @clikc="gender = 'male'">男</button>
    <button @clikc="gender = 'female'">女</button>
    <p>用户列表</p>
    <ul>
      <li v-for="(value, key) in userList" :key="key">
        用户名：{{ value.name }}，性别：{{ value.gender }}
      </li>
    </ul>
  </div>
</template>
```

## 侦听器（watch）

watch 对象接受一个 函数/对象 ，且必须对应 data 中的值名称（key）。函数接受两个参数，第一个表示改变之后的值（newValue），第二个表示改变之前的值（oldValue）。示例：

::: info watch 监听触发的条件

- 普通类型：值改变就改变。
- 对象类型：对象的地址改变触发（对象重新赋值，不论对象的内容是否相同），但是对象内对应的属性如果不变则该属性不会触发。

:::

### 基础用法

```js
data() {
  return {
    value: ''
  }
},
watch: {
  value(newValue, oldValue) {
    ...
  }
}
```

### 对象形式

```js
data() {
  return {
    value: ''
  }
},
watch: {
  value: {
    /* 监听值改变时执行的函数 */
    handler(){ },
    /* 如果是对象，是否深度监听（监听对象中的每个属性），默认false */
    deep: true,
    /* 是否在首次赋值时触发，默认false */
    immediate: true,
  }
}
```

### 实例调用

```js
vm.$watch('n', function() {}, { immediate: true })
/* or */
this.$watch('n', function() {}, { immediate: true })
```

::: tip 注意

Vue 中的 watch 操作都是异步执行的，所以如果要 watch 根据当前某个值做一些后续的操作，需要调用 [`vm.$nextTick( [callback] )`](https://cn.vuejs.org/v2/api/#vm-nextTick)。

:::

**模拟历史记录功能**

假如要存储一个数字计算前的结果，每次值被修改时就可以利用 `watch` 存储，如下：

```js
data() {
  return {
    number: 0,
    history: []
  }
},
watch: {
  number(newValue, oldValue) {
    this.history.push({ form: oldValue, to: newValue })
  }
}
```

其中 `history` 表示历史记录列表，每次 `number` 被修改，都会在 `history` 中存储一个对象，对象的 `form` 存储了改变之前的值， `to` 存储的了改变之后的值。

这样就可以模拟计算一个具有撤回功能的数值，如下：

```js
data() {
  return {
    number: 0,
    history: [],
    inUndoMode: false
  }
},
watch: {
  number(newValue, oldValue) {
    if (!this.inUndoMode) {
      this.history.push({ form: oldValue, to: newValue })
    }
  }
},
methods: {
  clickGoBack() {
    const length = this.history.length
    if (length && length > 0) {
      const last = this.history.pop()
      const oldValue = last.form
      this.inUndoMode = true
      this.number = oldValue
      this.$nextTick(() => {
        this.inUndoMode = false
      })
    }
  }
}
```

其中 `inUndoMode` 表示处于撤销状态，在撤销状态下禁止 `watch` 存储值，但是由于 **`watch` 是异步的**，所以要调用 `vm.$nextTick`，等待当前代码执行完成后再关闭该状态。

然后在 `template` 中绑定事件和值：

```vue
<template>
  <div class="watch-demo">
    <!-- 监听的数据 -->
    <div class="number">{{ number }}</div>
    <!-- 操作按钮 -->
    <button @click="number += 1">+1</button>
    <button @click="number -= 1">-1</button>
    <button @click="number += 2">+2</button>
    <button @click="number -= 2">-2</button>
    <!-- 绑定撤销按钮 -->
    <div class="go-back">
      <button @click="clickGoBack">撤销</button>
    </div>
    <!-- 展示历史数据 -->
    <div class="display-data">
      <pre class="language-js">{{ history }}</pre>
    </div>
  </div>
</template>
```