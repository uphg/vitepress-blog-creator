import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  srcDir: './content',
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
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../src', import.meta.url))
      }
    }
  },
  async buildEnd(siteConfig) {
    console.log('siteConfig')
    console.log(siteConfig)
    // ...
  },
  async postRender(context) {
    // ...
    console.log('postRender - context')
    console.log(context)
  },
  async transformHead(context) {
    console.log('transformHead - context')
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
    } else {

    }
  }
})
