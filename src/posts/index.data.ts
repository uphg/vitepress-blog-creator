import { createPagingPosts, getPosts } from '../../.vitepress/shared/posts'
import { pageSize } from '../../.vitepress/shared/common'

export default {
  watch: ['./post/**/*.md'],
  async load(_watchedFiles) {
    const posts = await getPosts()
    const pagingPosts = createPagingPosts(posts, { pageSize, pathPrefix: '/posts/' })
    return {
      ...pagingPosts[0],
      total: pagingPosts.length
    }
  }
}