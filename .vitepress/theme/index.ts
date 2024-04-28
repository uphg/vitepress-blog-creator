// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import About from './components/About.vue'
import Posts from './components/Posts.vue'
import Tags from './components/Tags.vue'
import DocHeader from './components/DocHeader.vue'
import Emoji from './components/Emoji.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-before': () => h(DocHeader),
      'nav-bar-title-after': () => h(Emoji)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('about', About)
    app.component('posts', Posts)
    app.component('tags', Tags)
  }
} satisfies Theme
