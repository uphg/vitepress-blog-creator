---
layout: tags
sidebar: false
---

<TagsContainer title="标签">
  <Tag v-for="item, index in data.tags" :key="index" :to="item.path">{{ item.name }}</Tag>
</TagsContainer>

<script setup lang="ts">
import Tag from '~theme/components/Tag.vue'
import TagsContainer from '~theme/components/TagsContainer.vue'
import { data } from './index.data'
</script>
