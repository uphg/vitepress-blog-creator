---
title: Vue Prop 自定义属性
date: 2020-11-24T17:35:00+08:00

tags:
  - Vue
---

官方文档：[https://cn.vuejs.org/v2/guide/components-props.html](https://cn.vuejs.org/v2/guide/components-props.html)

## Prop 的大小写

语法示例

```js
Vue.component('blog-post', {
  // 下面的 postTitle 在JS中是驼峰式命名法
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

但由于 HTML 中的属性对大小写不敏感，所以在模板中要按照以下方式书写

```html
<!-- 在 HTML 中需要写为短横线分隔的：kebab-case -->
<blog-post post-title="hello!"></blog-post>
```

## Prop 类型

未定义类型的写法

```js
props: ['title', 'likes', 'isPublished']
```

指定类型

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

## Prop 类型验证

Prop 属性还可以以对象的形式指定类型验证

```js
Vue.component('my-component', {
  props: {
    // 只能是数字 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 可以是字符串或数字
    propB: [String, Number],
    // 这个属性是必填的，并且只能是字符串类型
    propC: {
      type: String,
      required: true
    },
    // 数字类型值，默认值为100
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数（工厂函数：就是返回值是一个对象的函数）获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数（自定义值范围，值为value参数）
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

## Prop 传值

默认情况下，prop 只能通过父组件向子组件传值，子组件无法通过 prop 向父组件传值。

不过我们可以通过 Vue 自带的 on、emit 事件实现父子组件通信

```vue
<!-- 子组件触发事件（HelloWorld） -->
<button @click="$emit('message', 'hi')">点击发送消息</button>
```
```vue
<!-- 父组件监听事件 -->
<HelloWorld v-on:message="receiver" />
```
```js
// 父组件获取子组件的值
methods: {
  receiver(event) {
    this.message = event
  }
}
```

上面的方法有一个缺陷就是父组件的 receiver 方法不能够传入其他值。实际上，父组件的 v-on 事件指令还可以显式的向 receiver 方法暴露子组件发送的数据，只要改写为以下方式传入：

```vue
<!-- 父组件监听事件时通过 $event 传入子组件的数据 -->
<HelloWorld v-on:message="receiver($event, 2)" />
```
```js
// 父组件获取子组件的值
methods: {
  receiver(event, number) {
    this.message = event
  }
}
```

::: tip 注意

其中父组件的 `$event` 参数只能在该事件方法中使用。而子组件的 `$emit()` 方法也可以使用实例调用的方式 `vm.$emit()` 来调用。

:::

Prop 还可以结合 Vue 自带的 eventBus 功能实现更灵活的组件间通信

首先建立一个中间站 `bus.js` 文件，内容如下

```js
import Vue from 'vue'
export default new Vue()
```

在任意组件中都可以引入该文件进行发布 / 订阅事件，向其他组件传值

```js
import Bus from './bus.js'
export default {
  mounted() {
    // 发布事件
    Bus.$emit('data-massage', 'hi')
    // 监听事件
    Bus.$on('data-massage', (data) => {
      console.log(data)
    })
  }
}
```

> 以上案例链接：[https://codesandbox.io/s/practical-wiles-czbns](https://codesandbox.io/s/practical-wiles-czbns)