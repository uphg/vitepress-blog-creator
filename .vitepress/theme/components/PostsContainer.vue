<template>
  <CustomContainer :title="title" :description="description">
    <div class="post-list">
      <slot></slot>
    </div>
    <template #footer>
      <div v-if="!(!next && !prev)" class="bottom">
        <Link class="next" :to="next" :disabled="!next">
          <IconArrowLeft/>
          <span>{{ nextText }}</span>
        </Link>
        <div>{{ page }} / {{ total }}</div>
        <Link class="prev" :to="prev" :disabled="!prev">
          <span>{{ prevText }}</span>
          <IconArrowRight/>
        </Link>
      </div>
    </template>
  </CustomContainer>
</template>

<script setup lang="ts">
import CustomContainer from './CustomContainer.vue'
import Link from './Link.vue'
import IconArrowLeft from './icons/IconArrowLeft.vue';
import IconArrowRight from './icons/IconArrowRight.vue';

defineProps({
  title: String,
  description: String,
  next: [String, Number],
  prev: [String, Number],
  nextText: {
    type: String,
    default: 'Newer Posts'
  },
  prevText: {
    type: String,
    default: 'Older Posts'
  },
  page: [String, Number],
  total: [String, Number],
})
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-top: 2.5rem;
  min-height: calc(100vh - var(--vp-nav-height) - 40px - 40px - 24px - 40px);
}
.bottom {
  display: flex;
  padding-top: 2.5rem;
}
.next, 
.prev {
  display: flex;
  align-items: center;
  gap: .5rem;
  color: inherit;
  text-decoration: none;
  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}
.next {
  margin-right: auto;
}
.prev {
  margin-left: auto;
}
</style>