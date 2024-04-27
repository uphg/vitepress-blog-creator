---
title: Vue 造轮子 - JSX 语法
date: 2021-08-07T12:02:45+08:00

tags: 
  - Vue
---

记录在 Vue 3 中如何使用 JSX 语法。

## Vite JSX 插件

安装

```sh
yarn add -D @vitejs/plugin-vue-jsx
# or npm install -D @vitejs/plugin-vue-jsx
```

添加配置

```js
// vite.config.js
import vueJsx from '@vitejs/plugin-vue-jsx'

export default {
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ]
}
```

> 该插件只支持 Vue 3 版本

新建一个 Demo 文件测试

```jsx
import { defineComponent } from 'vue'

export default defineComponent({
  render() {
    return (
      <h1>hi</h1>
    )
  }
})
```

## 准备工作

为了防止 Jest 测试时报错，使用 JSX 时还需要添加以下内容

- 使用 JSX 前需要手动引入 Vue 中的 `h` 函数。
- 如果 JSX 中用到了 `<></>` 的语法，还需要引入 `Fragment`。

```jsx
import { h, Fragment } from 'vue'
```

## 指令

使用 v-show 指令

```tsx
import { h, Fragment, defineComponent, ref, withDirectives, vShow } from 'vue'

export default defineComponent({
  setup() {
    const visible = ref(false)
    return { visible }
  },
  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.visible = !this.visible
          }}
        >on/off</button>
        {
          withDirectives(
            <div>hi</div>,
            [
              [vShow, this.visible]
            ]
          )
        }
      </div>
    )
  }
})
```

## 插槽

创建多插槽组件

```tsx
import { h, Fragment, defineComponent, renderSlot } from 'vue';

// 推荐写法
export default defineComponent({
  name: 'Container',
  render() {
    return (
      <>
        <header>
          {renderSlot(this.$slots, 'header')}
        </header>
        <main>
          {renderSlot(this.$slots, 'default')}
        </main>
        <footer>
          {renderSlot(this.$slots, 'footer')}
        </footer>
      </>
    )
  }
})

// 或者
export default defineComponent({
  name: 'Container',
  render() {
    return (
      <>
        <header>
          {this.$slots.header?.()}
        </header>
        <main>
          {this.$slots.default?.()}
        </main>
        <footer>
          {this.$slots.footer?.()}
        </footer>
      </>
    )
  }
})
```

使用多插槽组件

```tsx
import { h, Fragment, defineComponent } from 'vue';
import Container from './Container.vue'

export default defineComponent({
  name: 'slotDemo',
  components: { Container },
  render() {
    return (
      <Container>
        {{
          header: () => <div>头部</div>,
          default: () => <div>内容</div>,
          footer: () => <span>底部</span>,
        }}
      </Container>
    )
  }
})
```