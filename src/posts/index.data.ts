import { createPagingPosts, getPosts } from '../../.vitepress/shared/posts'
import { pageSize } from '../../.vitepress/shared/common'

export default {
  watch: ['./post/**/*.md'],
  async load(watchedFiles) {
    // watchFiles 是一个所匹配文件的绝对路径的数组。
    // 生成一个博客文章元数据数组
    // 可用于在主题布局中呈现列表。
    const posts = await getPosts()
    const pagingPosts = createPagingPosts(posts, { pageSize, pathPrefix: '/posts/' })
    console.log('pagingPosts[0]')
    console.log(pagingPosts[0])
    return {
      ...pagingPosts[0],
      total: pagingPosts.length
    }
  }
}