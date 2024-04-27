<template>
  <article class="post-item" v-if="title">
    <h2 class="title">
      <Link class="title-text" :to="`${to}`">{{ title }}</Link>
    </h2>
    <div v-if="description" class="description">{{ description }}</div>
    <div class="bottom">
      <div v-if="date" class="date">
        <IconRoundAccessTime/>
        <span>{{ dayjs(date).format('YYYY-MM-DD') }}</span>
      </div>
      <div v-if="tags" class="tags">
        <Link v-for="item, index in tags" :key="index" class="tag" :to="`/tags/${item}/`">{{ item }}</Link>
      </div>
      <!-- <Link class="read" :to="`/post/${to}`">
        <span>查看更多</span>
        <IconArrowRight class="read-icon"/>
      </Link> -->
    </div>
  </article>
</template>

<script setup lang="ts">
import Link from './Link.vue';
import IconArrowRight from './icons/IconArrowRight.vue';
import IconRoundAccessTime from './icons/IconRoundAccessTime.vue'
import dayjs from 'dayjs'

defineProps({
  title: String,
  description: String,
  to: String,
  date: [String, Date],
  tags: [Array]
})
</script>

<style scoped>
.post-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-text {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.25s;
}
.title-text:hover {
  color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.description {
  color: var(--vp-c-text-3);
  line-height: 1.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read {
  display: flex;
  align-items: center;
  /* font-weight: 700; */
  font-size: .875rem;
  line-height: 1.25rem;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--vp-c-brand-1);
}

.read-icon {
  font-size: 1rem;
}

.bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (min-width: 640px) {
  .tags {
    margin-left: auto; 
  }
}

.tag {
  border-radius: 3px;
  font-size: 12px;
  padding: 0 6px;
  min-height: 18px;
  line-height: 18px;
  background-color: var(--vp-c-default-soft);
}
</style>