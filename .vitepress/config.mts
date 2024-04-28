import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Uphg",
  description: "A VitePress Site",
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'Tags', link: '/tags/' }
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
        '~theme': fileURLToPath(new URL('./theme', import.meta.url)),
        '~shared': fileURLToPath(new URL('./shared', import.meta.url))
      }
    }
  },
  async buildEnd(siteConfig) {
    // ...
  },
  async postRender(context) {
    // ...
  },
  async transformHead(context) {
  },
  async transformPageData(pageData, { siteConfig }) {
    if (pageData.filePath === 'api-examples.md') {

      pageData.frontmatter.prev = {
        text: '首页',
        link: '/'
      }
    } else {

    }
  }
})
