---
layout: page
---

<Wrap class="home">
  <h1 class="title">LvHeng <Emoji /></h1>    
  <!-- <p class="description">A migrant worker with little success.</p> -->
  <p class="description">A modestly successful migrant worker.</p>
  <h2>Projects</h2>
  <ul>
    <li><a href="/tulip/" target="_blank">Tulip UI</a> - UI component library based on Vue3 + TS.</li>
    <li><a href="/element-part/" target="_blank">Element Part</a> - Element UI extension package.</li>
    <li><a href="https://github.com/uphg/emitter" target="_blank">Small Emitter</a> - A Emitter event library.</li>
    <li><a href="https://github.com/uphg/local-proxy" target="_blank">App Local Proxy</a> - Web App local proxy script.</li>
  </ul>
  <h2>Blogs</h2>
  <ul>
    <li>Foo</li>
    <li>Bar</li>
    <li>...</li>
  </ul>
</Wrap>

<script setup lang="ts">
import { computed } from 'vue'
import Wrap from '~theme/components/Wrap.vue'
import Emoji from '~theme/components/Emoji.vue'
</script>

<style scoped>
.home {
  padding-top: 2.5rem;
  padding-bottom: 5rem;
}

.title {
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -.02em;
  white-space: pre-wrap;
}

.home a {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.25s, opacity 0.25s;
}

.home h2 {
  margin: 48px 0 16px;
  /* border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px; */
  letter-spacing: -.02em;
  line-height: 32px;
  font-size: 24px;
}

.home h1, .home h2, .home h3, .home h4, .home h5, .home h6 {
  position: relative;
  font-weight: 600;
  outline: none;
}
.home p {
  line-height: 28px;
  margin: 16px 0;
}
.home ul {
    list-style: disc;
}
.home ul, .home ol {
    padding-left: 1.25rem;
    margin: 16px 0;
}
</style>
