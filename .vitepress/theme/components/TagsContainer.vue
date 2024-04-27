<template>
  <CustomContainer :title="title" :description="description">
    <div class="tags">
      <slot></slot>
    </div>
  </CustomContainer>
</template>

<script setup lang="ts">
import CustomContainer from './CustomContainer.vue'

defineProps({
  title: String,
  description: String
})
</script>

<style scoped>
.tags {
  padding: 2.5rem 0;
  display: flex;
  flex-wrap: wrap;
}
</style>