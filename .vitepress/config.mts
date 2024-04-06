import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  async buildEnd(siteConfig) {
    console.log('siteConfig')
    console.log(siteConfig)
    // ...
  },
  async postRender(context) {
    // ...
    console.log('context')
    console.log(context)
  },
  async transformPageData(pageData, { siteConfig }) {
    console.log('pageData')
    console.log(pageData)
    if (pageData.filePath === 'api-examples.md') {
      pageData.frontmatter.prev = {
        text: '首页',
        link: '/'
      }
    }
  }
})
