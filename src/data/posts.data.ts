import { getPosts } from '../shared/getPosts'
import { getPagingPosts } from '../shared/getPagingPosts'
import { createContentLoader } from 'vitepress'
import { orderBy } from 'lodash-es'

// content/post/**/*.md
export default createContentLoader('./post/**/*.md', {
  // includeSrc: true, // 包含原始 markdown 源?
  render: true,     // 包含渲染的整页 HTML?
  excerpt: true,    // 包含摘录?
  transform(rawData) {
    // 根据需要对原始数据进行 map、sort 或 filter
    // 最终的结果是将发送给客户端的内容
    const posts = getPosts(rawData)
    return getPagingPosts(posts)
  }
})

