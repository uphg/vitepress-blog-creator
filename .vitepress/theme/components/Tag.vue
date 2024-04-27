<template>
  <Link class="tag" :to="`/tags/${to}/`">
    <slot></slot>
  </Link>
</template>

<script setup>
import Link from './Link.vue';

defineProps({
  to: String
})
</script>

<style scoped>
.tag {
  padding: .25rem .75rem;
  border-radius: .5rem;
  color: inherit;
  text-decoration: inherit;
  background-color: var(--vp-c-default-soft);
  cursor: pointer;
  margin-right: 12px;
  margin-bottom: 12px;
}
</style>