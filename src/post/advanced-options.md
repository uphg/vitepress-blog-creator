---
title: Vue 进阶属性
date: 2020-12-06T13:30:22+08:00

tags: 
  - Vue
  - directives
  - mixins
  - extends
  - provide
  - inject
---

## directives 指令

除了 Vue 官方内置的指令 (`v-model` 和 `v-if` 等) ，Vue 还允许我们自定义指令。

添加一个 focus 指令，使元素自动聚焦：

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el) { el.focus() // 聚焦元素 }
})
```

如果只想在当前组件中使用该命令，可以使用局部注册：

```js
directives: {
  focus: {
    // 指令的定义
    inserted(el) { el.focus() }
  }
}
```

### 钩子函数

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

| 函数名称           | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| `bind`             | 只调用一次，指令**第一次绑定到元素时调用**。                 |
| `inserted`         | **被绑定元素插入父节点时调用** (仅保证父节点存在，类似 `created` 钩子)。 |
| `update`           | 所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。 |
| `componentUpdated` | 指令所在组件的 VNode **及其子 VNode** 全部更新后调用。       |
| `unbind`           | 只调用一次，指令与元素解绑时调用。                           |

每个钩子函数都带有几个参数 (即 **`el`**、**`binding`**、`vnode` 和 `oldVnode`)，参考[官方文档](https://cn.vuejs.org/v2/guide/custom-directive.html#钩子函数参数)。

::: tip 注意

通常我们在 `bind` 或 `inserted` 函数中添加的事件监听，都需要在 `unbind` 中消除掉，否则元素消除后事件监听还会存在。

:::

### 聚焦指令

可以自定义一个全局的 `input` 聚焦指令，方便第一次加载页面时聚焦。

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时执行
  inserted(el) {
    if (el.nodeName === 'INPUT') {
      el.focus()
    } else {
      // 聚焦它的子元素中的第一个 input
      el.querySelector('input').focus()
    }
  }
})
```

> 该指令兼容 element 组件，添加了一个标签判断，如果当前标签为 input 则直接聚焦，否则取子元素的第一个 input 元素聚焦。

### 实现 v-on 事件绑定

注册指令

```js
Vue.directive('on2', {
  bind(el, info) {
    const {arg, value} = info
    el.addEventListener(arg, value)
  },
  unbind(el, info) {
    const {arg, value} = info
    el.removeEventListener(arg, value);
  }
})
```

使用方式

```vue
<button v-on2:click="add">点击按钮</button>
```

**指令的主要用途：**

主要用于原生 DOM 操作，譬如某个 DOM 操作你经常使用，或该 DOM 操作十分复杂。

## mixins 混入

主要用于减少 data、methods、钩子函数的重复代码，案例如下:

```js
// 创建一个 log.js 文件，添加以下内容
export default {
  data() {
    return { name: '' }
  },
  created() {
    console.log(`${this.name}出生了`)
  },
  beforeDestroy() {
    console.log(`${this.name}死亡了`)
  }
}
```

```js
// 在一个组件中引入该文件
import log from './mixins/log.js'
export default {
  mixins: [log],
  data() {
    return { name: 'Child' }
  }
}
```

此时该件就复制了 `log.js` 中的所有钩子函数的内容，并且会让组件覆盖 mixin 中 data 的相同属性。

> 复制规则：[https://cn.vuejs.org/v2/guide/mixins.html](https://cn.vuejs.org/v2/guide/mixins.html)


## extends 继承 / 拓展

extends 的作用是拓展一个组件，和 mixins 类似，案例如下：

```js
// 使用 extends 引入一个 mixins
import Vue from "vue"
import log from "./mixins/log.js"
const MyVue = Vue.extend({
    mixins: [log]
})
export default MyVue
```

```js
// 在组件中引入该 extends
import MyVue from './extends/MyVue.js'
export default {
  extends: MyVue,
}
```

::: tip 注意

此处的 `extends` 对象只能引入一个 `MyVue` 模块。

:::


## `provide` & `inject`

- `provide` 以函数的形式返回一个对象，对象中的数据可以是 `data` 或 `methods` 。
- `inject` 通常以数组形式接收 `provide` 返回的对象中的 `key`。

基本例子

```js
// 最外层的父组件首先声明一个 provide 函数，将需要注入的数据导出
data() {
  return {
    name: ''
  }
},
provide() {
  return {
    name: this.name,
    plus: this.plus,
  }
},
methods: {
  plus() { ... }
}
```

```js
// 子孙组件引入
inject: ['name', 'plus']
```

使用 provide 和 inject 结合 eventBus 实现发布订阅 

```js
// 父组件声明 eventBus
import Vue from 'vue'
export default {
  data() {
    return {
      eventBus: new Vue()
    }
  },
  provide() {
    return {
      eventBus: this.eventBus
    }
  },
  mounted() {
    // 发布事件
    this.eventBus.$emit('parent-data', 'Hello Child')
    // 订阅事件
    this.eventBus.$on('child-data', (data) => {
      console.log(data)
    })
  }
}
```

```js
export default {
  inject: ['eventBus'],
  mounted() {
    // 订阅事件
    this.eventBus.$on('parent-data', (data) => {
      console.log(data)
    })
    this.eventBus.$emit('child-data', 'Hello Parent')
  }
}
```