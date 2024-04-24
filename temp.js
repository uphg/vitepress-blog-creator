const a = {
  src: '---\r\n' +
    'title: Vue3 配置 ESLint\r\n' +
    'date: 2021-11-16T18:01:05+08:00\r\n' +
    'tags:\r\n' +
    '  - Vue3\r\n' +
    '  - ESLint\r\n' +
    '---\r\n' +
    '\r\n' +
    '记录 Vue3 项目配置 ESLint 的过程，主要配置流程：\r\n' +
    '\r\n' +
    '- Vue ESLint 插件\r\n' +
    '- TS 类型检测\r\n' +
    '- ~~Prettierrc 自动格式化~~\r\n' +
    '\r\n' +
    '## eslint-plugin-vue 插件\r\n' +
    '\r\n' +
    '安装 [eslint-plugin-vue](https://eslint.vuejs.org/)\r\n' +
    '\r\n' +
    '```bash\r\n' +
    'yarn add -D eslint eslint-plugin-vue\r\n' +
    '```\r\n' +
    '\r\n' +
    '::: tip 要求\r\n' +
    '\r\n' +
    '- ESLint v6.2.0 及以上\r\n' +
    '- Node.js v12.22.x，v14.17.x，v16.x 及更高版本\r\n' +
    '\r\n' +
    ':::\r\n' +
    '\r\n' +
    '创建 `.eslintrc.js` 文件，添加以下内容\r\n' +
    '\r\n' +
    '```js\r\n' +
    'module.exports = {\r\n' +
    '  extends: [\r\n' +
    '    // add more generic rulesets here, such as:\r\n' +
    "    // 'eslint:recommended',\r\n" +
    "    'plugin:vue/vue3-recommended',\r\n" +
    '  ],\r\n' +
    '  rules: {\r\n' +
    '    // override/add rules settings here, such as:\r\n' +
    "    // 'vue/no-unused-vars': 'error'\r\n" +
    '  }\r\n' +
    '}\r\n' +
    '```\r\n' +
    '\r\n' +
    '如果使用了 jsx 语法，需要在 ESLint 配置中启用 JSX\r\n' +
    '\r\n' +
    '```diff\r\n' +
    '  "parserOptions": {\r\n' +
    '      "ecmaVersion": 2020,\r\n' +
    '      "ecmaFeatures": {\r\n' +
    '+         "jsx": true\r\n' +
    '      }\r\n' +
    '  }\r\n' +
    '```\r\n' +
    '\r\n' +
    '在 `package.json` 中添加以下脚本\r\n' +
    '\r\n' +
    '```json\r\n' +
    '{\r\n' +
    '  "scripts": {\r\n' +
    '    "lint": "eslint \\"src/**/*.{js,ts,tsx,vue}\\""\r\n' +
    '  }\r\n' +
    '}\r\n' +
    '```\r\n' +
    '\r\n' +
    '然后，运行 `yarn lint` 检测代码，运行 `yarn lint --fix` 自动修复\r\n' +
    '\r\n' +
    '## 添加 TypeScript 检测\r\n' +
    '\r\n' +
    '安装 [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)\r\n' +
    '\r\n' +
    '```sh\r\n' +
    'yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin\r\n' +
    '# 或 npm i --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin\r\n' +
    '```\r\n' +
    '\r\n' +
    '在 `.eslintrc.js` 中添加以下配置\r\n' +
    '\r\n' +
    '```js\r\n' +
    '{\r\n' +
    '  extends: [\r\n' +
    "    'plugin:@typescript-eslint/recommended'\r\n" +
    '  ]\r\n' +
    '\r\n' +
    '  // 解决 TS 语法检测与 vue-eslint-parser 插件冲突的问题\r\n' +
    '  parser: "vue-eslint-parser",\r\n' +
    '  parserOptions: {\r\n' +
    '    parser: "@typescript-eslint/parser",\r\n' +
    '    ecmaVersion: 2020,\r\n' +
    '    sourceType: "module",\r\n' +
    '    // 配置 jsx\r\n' +
    '    ecmaFeatures: {\r\n' +
    '      jsx: true,\r\n' +
    '      tsx: true\r\n' +
    '    }\r\n' +
    '  }\r\n' +
    "  plugins: ['@typescript-eslint']\r\n" +
    '}\r\n' +
    '```\r\n' +
    '\r\n' +
    '然后添加以下配置，让 ESLint 只在 `*.ts`、`*.tsx`、`*.vue` 文件中启用 TS 格式化检测\r\n' +
    '\r\n' +
    '```js\r\n' +
    '{\r\n' +
    '  rules: {\r\n' +
    '    // 禁用所有文件中的 TS 规则\r\n' +
    "    '@typescript-eslint/explicit-module-boundary-types': 'off'\r\n" +
    '  },\r\n' +
    '  overrides: [\r\n' +
    '    {\r\n' +
    '      // 指定后缀文件启用 TypeScript 规则\r\n' +
    '      files: ["*.ts", "*.tsx", "*.vue"],\r\n' +
    '      rules: {\r\n' +
    '        "@typescript-eslint/explicit-module-boundary-types": ["error"]\r\n' +
    '      }\r\n' +
    '    }\r\n' +
    '  ]\r\n' +
    '}\r\n' +
    '```\r\n' +
    '\r\n' +
    '## 添加 Prettierrc <Badge text="可选" />\r\n' +
    '\r\n' +
    '由于 Prettierrc 可能与 ESLint 规则中的 Vue 规则冲突，此配置项为可选配置\r\n' +
    '\r\n' +
    '安装\r\n' +
    '\r\n' +
    '```sh\r\n' +
    'yarn add prettier --dev --exact # exact 安装时保存为确切的版本\r\n' +
    'yarn add eslint-plugin-prettier --dev\r\n' +
    '```\r\n' +
    '\r\n' +
    '在 `.eslintrc.js` 中添加配置\r\n' +
    '\r\n' +
    '```js\r\n' +
    '{\r\n' +
    '  extends: [\r\n' +
    '    // ...\r\n' +
    "    // 'eslint:recommended',\r\n" +
    '    // ...\r\n' +
    "    'plugin:vue/vue3-recommended',\r\n" +
    '    // ...\r\n' +
    '    "prettier"\r\n' +
    '    // 确保 prettier 是此列表的最后一项\r\n' +
    '  ],\r\n' +
    "  plugins: ['prettier'],\r\n" +
    '  rules: {\r\n' +
    "    'prettier/prettier': [\r\n" +
    "      'error',\r\n" +
    "      { endOfLine: 'auto' } // 自动兼容 Linux 与 Windows 换行\r\n" +
    '    ]\r\n' +
    '  }\r\n' +
    '}\r\n' +
    '```\r\n' +
    '\r\n' +
    '添加 `.prettier` 配置文件\r\n' +
    '\r\n' +
    '```json\r\n' +
    '{\r\n' +
    '  "semi": false, // 关闭在每一条语句末尾添加分号\r\n' +
    '  "singleQuote": true, // 使用单引号\r\n' +
    '  "trailingComma": "none", // 关闭对象末尾逗号\r\n' +
    '  "overrides": [ // 覆盖指定文件配置\r\n' +
    '    {\r\n' +
    '      "files": ".prettierrc",\r\n' +
    '      "options": {\r\n' +
    '        "parser": "json"\r\n' +
    '      }\r\n' +
    '    }\r\n' +
    '  ]\r\n' +
    '}\r\n' +
    '```\r\n' +
    '\r\n' +
    '\r\n' +
    '## ESLint 配置参考\r\n' +
    '\r\n' +
    '::: details <code>.eslintrc.js</code> 配置文件示例\r\n' +
    '\r\n' +
    '```js\r\n' +
    'module.exports = {\r\n' +
    '  // 环境\r\n' +
    '  env: {\r\n' +
    "    'vue/setup-compiler-macros': true, // 修复 defineProps、defineEmits 未定义的错误警告\r\n" +
    '    browser: true, // 浏览器\r\n' +
    '    node: true // Node\r\n' +
    '  },\r\n' +
    '  extends: [\r\n' +
    "    'eslint:recommended',\r\n" +
    "    'plugin:@typescript-eslint/recommended',\r\n" +
    "    'plugin:vue/vue3-recommended'\r\n" +
    '  ],\r\n' +
    "  plugins: ['@typescript-eslint', 'import'],\r\n" +
    "  parser: 'vue-eslint-parser',\r\n" +
    '  parserOptions: {\r\n' +
    "    parser: '@typescript-eslint/parser', // 防止与 vue-eslint-parser 插件冲突\r\n" +
    '    ecmaVersion: 2020,\r\n' +
    "    sourceType: 'module',\r\n" +
    '    ecmaFeatures: {\r\n' +
    '      // 配置 jsx\r\n' +
    '      jsx: true,\r\n' +
    '      tsx: true\r\n' +
    '    }\r\n' +
    '  },\r\n' +
    '  overrides: [\r\n' +
    '    // 指定 TS 类型检测启用的文件后缀\r\n' +
    '    {\r\n' +
    "      files: ['*.ts', '*.tsx', '.vue'],\r\n" +
    '      rules: {\r\n' +
    "        'no-undef': 'off' // 参考：https://eslint.org/docs/rules/no-undef\r\n" +
    '      }\r\n' +
    '    }\r\n' +
    '  ],\r\n' +
    '  rules: {\r\n' +
    '    // js/ts\r\n' +
    "    indent: ['error', 2], // 缩进风格\r\n" +
    "    quotes: ['error', 'single', { 'avoidEscape': true }], // 使用单引号\r\n" +
    "    'comma-dangle': ['error', 'never'], // 禁止对象尾逗号\r\n" +
    "    'no-restricted-syntax': [\r\n" +
    "      'error',\r\n" +
    "      'WithStatement', // with 语句\r\n" +
    `      "BinaryExpression[operator='in']" // in 运算符\r\n` +
    '    ], // 禁止特定语法，参考：https://eslint.org/docs/rules/no-restricted-syntax\r\n' +
    "    camelcase: 'error', // 必须使用驼峰式命名法，参考：https://eslint.org/docs/rules/camelcase\r\n" +
    "    'no-var': 'error',\r\n" +
    "    'no-empty': 'error', // 禁止空的块语句，参考：https://eslint.org/docs/rules/no-empty\r\n" +
    "    'prefer-const': [\r\n" +
    "      'warn',\r\n" +
    "      { destructuring: 'all' /* ignoreReadBeforeAssign: true */ }\r\n" +
    '    ], // 使用 const 声明固定值，参考：https://cn.eslint.org/docs/rules/prefer-const\r\n' +
    "    'prefer-template': 'error', // 使用模板字面量拼接字符串，参考：https://eslint.org/docs/rules/prefer-template\r\n" +
    "    'object-shorthand': 'off', // 使用 ES6+ 语法简写对象，参考：https://eslint.org/docs/rules/object-shorthand\r\n" +
    "    'no-constant-condition': 'error', // 禁止在条件语句中使用常量，参考：https://eslint.org/docs/rules/no-constant-condition\r\n" +
    '\r\n' +
    '    // TS\r\n' +
    "    '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭全局 TS 检测，只检测指定后缀文件，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md#configuring-in-a-mixed-jsts-codebase\r\n" +
    "    '@typescript-eslint/no-explicit-any': 'off', // 关闭：禁止使用 any 类型，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md\r\n" +
    "    // '@typescript-eslint/no-non-null-assertion': 'off', // 关闭：禁止使用 ! 进行非空断言，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md\r\n" +
    "    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off', // 关闭：禁止在可选链后使用 ! 进行非空断言，参考：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.md\r\n" +
    '\r\n' +
    '    // vue\r\n' +
    "    'vue/no-v-html': 'off', // 关闭：禁止使用 v-html\r\n" +
    "    'vue/require-default-prop': 'off', // 关闭：props 指定类型后必须带有默认值\r\n" +
    "    // 'vue/require-explicit-emits': 'off', // 关闭：必须要显示的声明 emits，才能使用\r\n" +
    "    'vue/multi-word-component-names': 'off', // 关闭：组件名必须由多个单词组成\r\n" +
    "    'vue/component-definition-name-casing': 'off',\r\n" +
    "    // 'vue/comma-dangle': 'off', // 尾部逗号\r\n" +
    "    'vue/multiline-html-element-content-newline': ['off'],\r\n" +
    "    'vue/singleline-html-element-content-newline': ['off'],\r\n" +
    "    'vue/max-attributes-per-line': [\r\n" +
    "      'error',\r\n" +
    '      {\r\n' +
    '        singleline: 3,\r\n' +
    '        multiline: 1\r\n' +
    '      }\r\n' +
    '    ]\r\n' +
    '  }\r\n' +
    '}\r\n' +
    '```\r\n' +
    '\r\n' +
    ':::\r\n',
  html: '<p>记录 Vue3 项目配置 ESLint 的过程，主要配置流程：</p>\n' +
    '<ul>\n' +
    '<li>Vue ESLint 插件</li>\n' +
    '<li>TS 类型检测</li>\n' +
    '<li><s>Prettierrc 自动格式化</s></li>\n' +
    '</ul>\n' +
    '<h2 id="eslint-plugin-vue-插件" tabindex="-1">eslint-plugin-vue 插件 <a class="header-anchor" href="#eslint-plugin-vue-插件" aria-label="Permalink to &quot;eslint-plugin-vue 插件&quot;">&ZeroWidthSpace;</a></h2>\n' +
    '<p>安装 <a href="https://eslint.vuejs.org/" target="_blank" rel="noreferrer">eslint-plugin-vue</a></p>\n' +
    '<div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" v-pre=""><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> add</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> -D</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> eslint</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> eslint-plugin-vue</span></span></code></pre>\n' +
    '</div><div class="tip custom-block"><p class="custom-block-title">要求</p>\n' +
    '<ul>\n' +
    '<li>ESLint v6.2.0 及以上</li>\n' +
    '<li>Node.js v12.22.x，v14.17.x，v16.x 及更高版本</li>\n' +
    '</ul>\n' +
    '</div>\n' +
    '<p>创建 <code>.eslintrc.js</code> 文件，添加以下内容</p>\n' +
    '<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" v-pre=""><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  extends: [</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // add more generic rulesets here, such as:</span></span>\n' +
    `<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // 'eslint:recommended',</span></span>\n` +
    `<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">    'plugin:vue/vue3-recommended'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>\n` +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  rules: {</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // override/add rules settings here, such as:</span></span>\n' +
    `<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // 'vue/no-unused-vars': 'error'</span></span>\n` +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre>\n' +
    '</div><p>如果使用了 jsx 语法，需要在 ESLint 配置中启用 JSX</p>\n' +
    '<div class="language-diff vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">diff</span><pre class="shiki shiki-themes github-light github-dark vp-code" v-pre=""><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  "parserOptions": {</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      "ecmaVersion": 2020,</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      "ecmaFeatures": {</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">+         "jsx": true</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      }</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span></code></pre>\n' +
    '</div><p>在 <code>package.json</code> 中添加以下脚本</p>\n' +
    '<div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" v-pre=""><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">{</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  "scripts"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: {</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    "lint"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"eslint </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\\"</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">src/**/*.{js,ts,tsx,vue}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\\"</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre>\n' +
    '</div><p>然后，运行 <code>yarn lint</code> 检测代码，运行 <code>yarn lint --fix</code> 自动修复</p>\n' +
    '<h2 id="添加-typescript-检测" tabindex="-1">添加 TypeScript 检测 <a class="header-anchor" href="#添加-typescript-检测" aria-label="Permalink to &quot;添加 TypeScript 检测&quot;">&ZeroWidthSpace;</a></h2>\n' +
    '<p>安装 <a href="https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin" target="_blank" rel="noreferrer">@typescript-eslint/eslint-plugin</a></p>\n' +
    '<div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" v-pre=""><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> add</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> -D</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @typescript-eslint/parser</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @typescript-eslint/eslint-plugin</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"># 或 npm i --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin</span></span></code></pre>\n' +
    '</div><p>在 <code>.eslintrc.js</code> 中添加以下配置</p>\n' +
    '<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" v-pre=""><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">{</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  extends</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: [</span></span>\n' +
    `<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">    'plugin:@typescript-eslint/recommended'</span></span>\n` +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ]</span></span>\n' +
    '<span class="line"></span>\n' +
    '<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">  // 解决 TS 语法检测与 vue-eslint-parser 插件冲突的问题</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  parser</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"vue-eslint-parser"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  parserOptions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: {</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">    parser</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"@typescript-eslint/parser"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">    ecmaVersion</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">2020</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">    sourceType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"module"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // 配置 jsx</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">    ecmaFeatures</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: {</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">      jsx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">      tsx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">true</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>\n' +
    '<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>\n' +
    `<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  plugins</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'@typescript-eslint'</span><span style="--shiki-light:#24`... 29233 more characters,
  frontmatter: {
    title: 'Vue3 配置 ESLint',
    date: 2021-11-16T10:01:05.000Z,
    tags: [Array]
  },
  excerpt: '',
  url: '/post/vue3-config-eslint.html'
}