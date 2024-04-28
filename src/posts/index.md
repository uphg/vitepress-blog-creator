---
layout: posts
sidebar: false
---

<PostsContainer
  title="博客列表"
  :next="data.next"
  :prev="data.prev"
  :page="data.page"
  :total="data.total">
  <PostItem
    v-for="item, index in data.items"
    :key="index"
    :title="item.title"
    :to="item.to"
    :description="item.description"
    :date="item.date"
    :tags="item.tags"
  />
</PostsContainer>

<script setup lang="ts">
import { data } from './index.data'
import PostItem from '~theme/components/PostItem.vue'
import PostsContainer from '~theme/components/PostsContainer.vue'
</script>
