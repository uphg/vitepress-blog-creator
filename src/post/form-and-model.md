---
title: Vue 表单与输入绑定
date: 2020-11-25T22:07:22+08:00

tags: 
  - Vue
---

::: info 双向绑定

双向绑定就是在变量被改变时，视图UI会跟着变化。在用户改变视图内容时，变量也会跟着改变。

:::

## 表单输入绑定

使用方式

```vue
<input v-model="message" type="text">
```

`v-model` 实际上是 `v-on:input` 与 `v-bind:value` 的语法糖，它的实现原理大致如下：

```vue
<input
  :value="message"
  v-on:input="message = $event.target.value"
  type="text"
>
<p>输入的内容 (message)：{{message}}</p>
```

## 表单提交

案例：通过监听 form 表单的 submit 事件，实现回车提交表单

```vue
<div>
  <h2>登录</h2>
  <form @submit.prevent="onSubmit">
    <label>
      <span>用户名：</span>
      <input type="text" v-model="user.username" />
    </label>
    <label>
      <span>密码：</span>
      <input type="password" v-model="user.password" />
    </label>
    <button type="submit">登录</button>
  </form>
</div>
```
```js
data() {
  return {
    user: {
      username: '',
      password: ''
    }
  }
},
methods: {
  onSubmit() {
    console.log('# this.user')
    console.log(this.user)
  }
}
```

::: tip 注意

form 标签需要包裹提交的内容，并且 form 表单中必须有一个 button 按钮才能够触发提交。

:::

## 账号相关表单验证

验证正则规则

```js
/* 账号验证（只允许英文字母下划线） */
value.replace(/[^\w_]/g, '')

/* 密码验证（不允许输入中文） */
value.replace(/[\u4e00-\u9fa5\s]/g, '')

/* 验证码验证（只允许输入英文、数字） */
value.replace(/[^\a-\z\A-\Z0-9]/g, '')

/* 手机号验证 */
value.replace(/^0|[^\d]/g, '')
```

Vue 表单中使用

```vue
<input
  v-model="form.username"
  placeholder="请输入账号"
  @input="form.username = form.username.replace(/[^\w_]/g, '')"
  type="text"
>
```