import { createPagingPosts, getPosts } from '../.vitepress/shared/posts'

export default {
  watch: ['./post/**/*.md'],
  async load(_watchedFiles) {
    const posts = await getPosts()
    const pagingPosts = createPagingPosts(posts, { pageSize: 5, pathPrefix: '/posts/' })
    return {
      ...pagingPosts[0],
      total: posts.length
    }
  }
}