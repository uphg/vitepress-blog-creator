---
title: Vue 动画原理
date: 2020-12-04T17:10:22+08:00

tags:
  - Vue
---

## 使用类名过渡

类名规则

1. **`v-enter`** ：进入过渡时最开始的状态
2. **`v-enter-active`** ：进入过渡的过渡效果，如 `transition: all 0.3s;`
3. `v-enter-to` ：进入过渡结束时的状态，如果不设置，则显示元素默认状态。
4. `v-leave` ：离开过渡时最开始的状态，如果不设置，则显示元素默认状态。
5. **`v-leave-active`** ：离开过渡的过渡效果，如 `transition: all 0.3s;`
6. **`v-leave-to`** ：离开过渡结束时的状态。

使用案例

```html
<div id="example-1">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
new Vue({
  el: "#example-1",
  data: {
    show: true,
  },
});
```

```css
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
```

::: tip 注意

类名过渡中的 `v-leave` 存在 bug，想要精确的控制，最好使用下面的 JS 钩子函数过渡。

:::

## CSS + animation 动画

还可以通过在 `v-enter-active` 和 `v-leave-active` 之间设置 animation 动画实现过渡。

```html
<div id="example-2">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">
      真、假、浑浊、无瑕；起、落、精准、偏差；模糊年岁，似已蒸发，天地倒挂；若人间是场大梦啊，梦里啷当巨铁锁人家，夜归的人叩响了门环，我要不要叫醒他；
    </p>
  </transition>
</div>
```

```js
new Vue({
  el: "#example-2",
  data: {
    show: true,
  },
});
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

## 指定 CSS 类名

还可以指定类名，结合其他第三方 CSS 动画库如 [animate.css](https://animate.style/) 使用

```html
<link
  href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1"
  rel="stylesheet"
  type="text/css"
/>
<div id="example-3">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated bounceInLeft"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
new Vue({
  el: "#example-3",
  data: {
    show: true,
  },
});
```

### Animate.css 模块化引入

安装

```js
yarn add animate.css
```

引入 4.x

```js
// 1. 组件化引入
import animate from "animate.css";
Vue.use(animate);
```

```js
// 2. 或直接引入 css
import "animate.min.css";
```

引入 3.x

```js
import "animate.css/animate.compat.css";
```

### 使用 Animate.css 4.0

由于 Animate.css 4.0 更新后改变了类名，使用的时候需要添加 `animate__` 前缀使用

```vue
<div id="app">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__bounceInLeft"
    leave-active-class="animate__animated animate__bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

## 钩子函数

可以在 attribute 中声明 JavaScript 钩子

```vue
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"

  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

```js
methods: {
  // === 进入时 ===
  beforeEnter(el) { },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  enter(el, done) { done() },
  afterEnter(el) { },
  enterCancelled(el) { },

  // === 离开时 ===
  beforeLeave(el) { },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  leave(el, done) { done() },
  afterLeave(el) { },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled(el) { }
}
```

还可以结合第三方库 Velocity.js 使用

```vue
<div id="example-4">
  <button @click="show = !show">Toggle</button>
  <transition
    appear
    @enter="enter"
    @leave="leave"
    :css="false"
  >
    <div v-if="show" class="demo-4"></div>
  </transition>
</div>
```

```js
data() {
  return {
    show: true
  }
},
methods: {
  // 进入过渡回调
  enter(el, done) {
    Velocity(el, { width: '300px' }, { duration: 300 })
    Velocity(el, { height: '300px;' }, { duration: 300 }, { complete: done })
  },
  // 离开过渡回调
  leave(el, done) {
    Velocity(el, { height: '150px' }, { duration: 300 })
    Velocity(el, { width: '0px' }, { duration: 300 }, { complete: done })
  }
}
```

```css
.demo-4 {
  width: 0;
  height: 150px;
  overflow: hidden;
  background-color: #eee;
}
```

## 初始渲染的过渡

transition 还支持第一次加载过渡，只要添加一个 `appear` 属性

```vue
<transition appear>
  <!-- ... -->
</transition>
```

和进入 / 离开过渡一样 `appear` 属性也支持自定义类名

```vue
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (2.1.8+)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```

且支持自定义 JavaScript 钩子：

```vue
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

## 多个元素的过渡

默认情况下 transition 中如果有多组件，过渡会一起执行，结合绝对定位，就可以实现无缝的过渡

::: tip 注意

多组件过渡需要给每个组件添加唯一的 `key` 属性

:::

```vue
<div id="example-5">
  <transition name="fade">
    <button
      v-if="status === 'off'"
      key="off"
      @click="status = 'on'"
    >off</button>
    <button
      v-else-if="status === 'on'"
      key="on"
      @click="status = 'off'"
    >on</button>
  </transition>
</div>
```

```js
data() {
  return {
    status: 'off'
  }
}
```

```css
#example-5 {
  position: relative;
}
button {
  position: absolute;
}

.fade-enter-active, .fade-leave-active {
  transition: all 1s;
}
.fade-enter {
  transform: translateX(100%);
  opacity: 0;
}
.fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
```

Vue 还提供了 **过渡模式**

- `in-out`：新元素先进行过渡，完成之后当前元素过渡离开。
- `out-in`：当前元素先进行过渡，完成之后新元素过渡进入。

用 in-out 添加一个开关按钮过渡：

```vue
<transition name="fade" mode="in-out">
  <!-- ... the buttons ... -->
</transition>
```

就会实现类似发牌的效果

## 拓展

- [列表过渡](https://cn.vuejs.org/v2/guide/transitions.html#列表过渡)
