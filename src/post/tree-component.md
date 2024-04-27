---
title: 使用递归组件
date: 2020-10-16T10:37:01+08:00

tags:
  - JavaScript
  - Vue
  - VueComponent
---

::: tip 注意

由于需要调用自身，所以必须含有 name 这个属性，因为没有 name 这个属性会造成控件自身不能调用自身。且调用自身组件最好绑定一个 key 值，方便 Vue 重新渲染。

:::

假设有如下数据结构的`data.js`

```js
export default [
  {
    title: "标题 1",
    content: "内容 1",
    child: [
      {
        title: "标题 1-1",
        content: "内容 1-1",
        child: [
          {
            title: "标题 1-1-1",
            content: "内容 1-1-1"
          }
        ]
      }
    ]
  },
  {
    title: "标题 2",
    content: "内容 2",
  }
]
```

那么组件（`tree.vue`）应当如下方式渲染

```vue
<template>
  <div class="tree">
    <ul v-for="(element, index) in data" :key="index">
      <li v-if="element.child">
        <div class="title">{{ element.title }}</div>
        <p class="content">{{ element.content }}</p>
        <tree :data="element.child" :key="index" />
      </li>
      <li v-else>
        <div class="title">{{ element.title }}</div>
        <p class="content">{{ element.content }}</p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "tree",
  props: {
    data: [],
  },
};
</script>
```

外层组件（`App.vue`）以如下方式引入

```vue
<template>
  <div id="app">
    <tree :data="dataList" />
  </div>
</template>
<script>
import tree from "./tree.vue";
import dataList from "./data.js";
export default {
  name: "App",
  components: {
    tree,
  },
  data() {
    return {
      dataList: [],
    };
  },
  mounted() {
    this.dataList = dataList;
  },
};
</script>
```

最终的渲染效果如下

<section class="re-part">
  <div class="tree eat-margin-vertical">
    <ul>
      <li>
        <div class="title">标题 1</div>
        <p class="content">内容 1</p>
        <div class="tree">
          <ul>
            <li>
              <div class="title">标题 1-1</div>
              <p class="content">内容 1-1</p>
              <div class="tree">
                <ul>
                  <li>
                    <div class="title">标题 1-1-1</div>
                    <p class="content">内容 1-1-1</p>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <ul>
      <li>
        <div class="title">标题 2</div>
        <p class="content">内容 2</p>
      </li>
    </ul>
  </div>
</section>

案例地址：[https://codesandbox.io/s/nice-proskuriakova-h804u?file=/src/App.vue](https://codesandbox.io/s/nice-proskuriakova-h804u?file=/src/App.vue)

<style scoped>
.eat-margin-vertical {
  margin-top: -16px;
  margin-bottom: -16px;
}
</style>
