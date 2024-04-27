import { getPosts } from '../../.vitepress/shared/posts'
import { getRawTags } from '../../.vitepress/shared/tags'

export default {
  watch: ['./post/**/*.md'],
  async load(watchedFiles) {
    // watchFiles 是一个所匹配文件的绝对路径的数组。
    // 生成一个博客文章元数据数组
    // 可用于在主题布局中呈现列表。
    const posts = await getPosts()
    const rawTags = getRawTags(posts)
    return { tags: rawTags.map(item => ({ name: item, path: item?.toLowerCase() })) }
  }
}