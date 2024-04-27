---
title: Vue 造轮子 - 测试用例
---

大部分语法来自 Jest

其中 `Wrapper` 是一个包括了一个挂载组件或 vnode，以及测试该组件或 vnode 的方法。

## 基本示例

判断一个 Button 组件是否存在

```js
// 期待 Button 组件存在
describe('Button', () => {
  it('create', () => {
    const wrapper = mount(Button)
    expect(wrapper.exists()).toBe(true)
  })
})
```

- `expect()`：期待。
- `.exists()`：断言是否存在。
- `.toBe()`：表示判断什么是什么（使用 `Object.is` 比较）。

## 验证点击事件

判断一个 Button 组件是否被点击

```js
describe('Button', () => {
  it('clickable', async () => {
    const onClick = jest.fn()
    const wrapper = mount(Button, {
      props: { onClick }
    })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
```

- `.toHaveBeenCalled()`：判断一个函数是否被调用。
- `.trigger(eventType)`：触发 DOM 上的事件，trigger 仅适用于原生的 DOM 事件。

## 验证样式改变

判断特定状态下组件 class 的变化

```js
describe('Button', () => {
  it('type', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
    })
    expect(wrapper.classes()).toContain('tu-button--primary')
    // 或者这样写：
    // expect(wrapper.classes('tu-button--primary')).toBe(true)
  })
})
```

- `.classes()`：返回包含 class 名称的数组。或在提供 class 名的时候返回一个布尔值。
- `.toContain(item)`：判断数组中是否存在某项。


## 验证是否存在指定子元素

判断是否存在某个子元素

```js
describe('Button', () => {
  it('icon', () => {
    const wrapper = mount(Button, {
      props: { icon: 'close' }
    })
    expect(wrapper.find('.tu-icon-close').exists()).toBeTruthy()
  })
})
```

- `.find()`：返回匹配选择器的第一个 DOM 节点或 Vue 组件的 `Wrapper`，可以使用任何有效的 DOM 选择器 (使用 `querySelector` 语法)。
- `.toBeTruthy()`：判断某个值转为布尔值时是否为真（除了 `false`，`0`，`''`，`null`，`undefined`，`NaN`）其他值都为真。

## 验证是否存在属性

判断 Button 组件是否可以设置原生的 type 属性

```js
describe('Button', () => {
  it('nativeType', () => {
    const wrapper = mount(Button, {
      props: { nativeType: 'submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
```

- `.attributes()`：返回 DOM 节点上的指定属性。

## 验证点击事件是否可用

判断 Button 的点击事件是否为 `undefined`

```js
describe('Button', () => {
  it('disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    })
    /* 测试 disabled 样式，暂时省略 */
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    // 或者你可以这样写：
    // expect(wrapper.emitted()).not.toHaveProperty('click')
  })
})
```

- `.toBeUndefined()`：只匹配 `undefined`。
- `.emitted()`：获取被触发的事件。
