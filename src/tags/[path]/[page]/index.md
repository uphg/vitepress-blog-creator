---
layout: posts
sidebar: false
---

<PostsContainer :title="`标签：${$params.name}`" :next="$params.next" :prev="$params.prev" :page="$params.page" :total="$params.total">
  <PostItem
    v-for="item, index in $params.items"
    :key="index"
    :title="item.title"
    :to="item.to"
    :description="item.description"
    :date="item.date"
    :tags="item.tags"
  />
</PostsContainer>

<script setup lang="ts">
import PostItem from '~theme/components/PostItem.vue'
import PostsContainer from '~theme/components/PostsContainer.vue'
</script>
