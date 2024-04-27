<template>
  <div class="doc-header">
    <h1 class="title">{{ frontmatter.title }}</h1>
    <div v-if="frontmatter.date" class="date">
      <span>发布于</span>&nbsp;<span>{{ dayjs(frontmatter.date).format('YYYY-MM-DD') }}</span>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import dayjs from 'dayjs'

const { frontmatter } = useData()
</script>

<style scoped>
.doc-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 12px;
}
.title {
  letter-spacing: -0.02em;
  line-height: 40px;
  font-size: 32px;
  position: relative;
  font-weight: 600;
  outline: none;
  overflow-wrap: break-word;
}
.date {
  font-size: 14px;
  color: var(--vp-c-text-3);
}

@media (min-width: 640px) {
  .doc-header {
    padding-top: 32px;
  }
}
</style>