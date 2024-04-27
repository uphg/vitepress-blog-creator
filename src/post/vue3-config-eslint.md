---
title: Vue3 配置 ESLint
date: 2021-11-16T18:01:05+08:00
tags:
  - Vue3
  - ESLint
---

记录 Vue3 项目配置 ESLint 的过程，主要配置流程：

- Vue ESLint 插件
- TS 类型检测
- ~~Prettierrc 自动格式化~~

## eslint-plugin-vue 插件

安装 [eslint-plugin-vue](https://eslint.vuejs.org/)

```bash
yarn add -D eslint eslint-plugin-vue
```

::: tip 要求

- ESLint v6.2.0 及以上
- Node.js v12.22.x，v14.17.x，v16.x 及更高版本

:::

创建 `.eslintrc.js` 文件，添加以下内容

```js
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
```

如果使用了 jsx 语法，需要在 ESLint 配置中启用 JSX

```diff
  "parserOptions": {
      "ecmaVersion": 2020,
      "ecmaFeatures": {
+         "jsx": true
      }
  }
```

在 `package.json` 中添加以下脚本

```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.{js,ts,tsx,vue}\""
  }
}
```

然后，运行 `yarn lint` 检测代码，运行 `yarn lint --fix` 自动修复

## 添加 TypeScript 检测

安装 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

```sh
yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
# 或 npm i --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

在 `.eslintrc.js` 中添加以下配置

```js
{
  extends: [
    'plugin:@typescript-eslint/recommended'
  ]

  // 解决 TS 语法检测与 vue-eslint-parser 插件冲突的问题
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    // 配置 jsx
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  }
  plugins: ['@typescript-eslint']
}
```

然后添加以下配置，让 ESLint 只在 `*.ts`、`*.tsx`、`*.vue` 文件中启用 TS 格式化检测

```js
{
  rules: {
    // 禁用所有文件中的 TS 规则
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
  overrides: [
    {
      // 指定后缀文件启用 TypeScript 规则
      files: ["*.ts", "*.tsx", "*.vue"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["error"]
      }
    }
  ]
}
```

## 添加 Prettierrc <Badge text="可选" />

由于 Prettierrc 可能与 ESLint 规则中的 Vue 规则冲突，此配置项为可选配置

安装

```sh
yarn add prettier --dev --exact # exact 安装时保存为确切的版本
yarn add eslint-plugin-prettier --dev
```

在 `.eslintrc.js` 中添加配置

```js
{
  extends: [
    // ...
    // 'eslint:recommended',
    // ...
    'plugin:vue/vue3-recommended',
    // ...
    "prettier"
    // 确保 prettier 是此列表的最后一项
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      { endOfLine: 'auto' } // 自动兼容 Linux 与 Windows 换行
    ]
  }
}
```

添加 `.prettier` 配置文件

```json
{
  "semi": false, // 关闭在每一条语句末尾添加分号
  "singleQuote": true, // 使用单引号
  "trailingComma": "none", // 关闭对象末尾逗号
  "overrides": [ // 覆盖指定文件配置
    {
      "files": ".prettierrc",
      "options": {
        "parser": "json"
      }
    }
  ]
}
```


## ESLint 配置参考

::: details <code>.eslintrc.js</code> 配置文件示例

```js
module.exports = {
  // 环境
  env: {
    'vue/setup-compiler-macros': true, // 修复 defineProps、defineEmits 未定义的错误警告
    browser: true, // 浏览器
    node: true // Node
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  plugins: ['@typescript-eslint', 'import'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // 防止与 vue-eslint-parser 插件冲突
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      // 配置 jsx
      jsx: true,
      tsx: true
    }
  },
  overrides: [
    // 指定 TS 类型检测启用的文件后缀
    {
      files: ['*.ts', '*.tsx', '.vue'],
      rules: {
        'no-undef': 'off' // 参考：https://eslint.org/docs/rules/no-undef
      }
    }
  ],
  rules: {
    // js/ts
    indent: ['error', 2], // 缩进风格
    quotes: ['error', 'single', { 'avoidEscape': true }], // 使用单引号
    'comma-dangle': ['error', 'never'], // 禁止对象尾逗号
    'no-restricted-syntax': [
      'error',
      'WithStatement', // with 语句
      "BinaryExpression[operator='in']" // in 运算符
    ], // 禁止特定语法，参考：https://eslint.org/docs/rules/no-restricted-syntax
    camelcase: 'error', // 必须使用驼峰式命名法，参考：https://eslint.org/docs/rules/camelcase
    'no-var': 'error',
    'no-empty': 'error', // 禁止空的块语句，参考：https://eslint.org/docs/rules/no-empty
    'prefer-const': [
      'warn',
      { destructuring: 'all' /* ignoreReadBeforeAssign: true */ }
    ], // 使用 const 声明固定值，参考：https://cn.eslint.org/docs/rules/prefer-const
    'prefer-template': 'error', // 使用模板字面量拼接字符串，参考：https://eslint.org/docs/rules/prefer-template
    'object-shorthand': 'off', // 使用 ES6+ 语法简写对象，参考：https://eslint.org/docs/rules/object-shorthand
    'no-constant-condition': 'error', // 禁止在条件语句中使用常量，参考：https://eslint.org/docs/rules/no-constant-condition

    // TS
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭全局 TS 检测，只检测指定后缀文件，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md#configuring-in-a-mixed-jsts-codebase
    '@typescript-eslint/no-explicit-any': 'off', // 关闭：禁止使用 any 类型，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
    // '@typescript-eslint/no-non-null-assertion': 'off', // 关闭：禁止使用 ! 进行非空断言，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off', // 关闭：禁止在可选链后使用 ! 进行非空断言，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.md

    // vue
    'vue/no-v-html': 'off', // 关闭：禁止使用 v-html
    'vue/require-default-prop': 'off', // 关闭：props 指定类型后必须带有默认值
    // 'vue/require-explicit-emits': 'off', // 关闭：必须要显示的声明 emits，才能使用
    'vue/multi-word-component-names': 'off', // 关闭：组件名必须由多个单词组成
    'vue/component-definition-name-casing': 'off',
    // 'vue/comma-dangle': 'off', // 尾部逗号
    'vue/multiline-html-element-content-newline': ['off'],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: 1
      }
    ]
  }
}
```

:::
