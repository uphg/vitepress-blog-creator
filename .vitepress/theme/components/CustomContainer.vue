<template>
  <div class="custom-container">
    <div class="header">
      <h1 class="title">{{ title }}</h1>
      <p v-if="description" class="description">{{ description }}</p>
    </div>
    <div class="body">
      <slot></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  description: String,
})
</script>

<style scoped>
.custom-container {
  padding: 2.5rem 0 5rem;
}
.header {
  display: flex;
  flex-direction: column;
  gap: 4;
}
.title {
  line-height: 2.5rem;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -.02em;
  white-space: pre-wrap;
}

.description {
  margin: 0;
}
</style>