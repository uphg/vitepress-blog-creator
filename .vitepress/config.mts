import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { getPrevOrNext } from './shared/posts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LvHeng",
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
    const { prev, next } = await getPrevOrNext(pageData.filePath)
    pageData.frontmatter.prev = prev
    pageData.frontmatter.next = next
  }
})
