import { createPagingPosts, getPosts } from "../../../.vitepress/shared/posts"
import { getPostByTag, getRawTags } from "../../../.vitepress/shared/tags"
import { pageSize } from '../../../.vitepress/shared/common'

export default {
  async paths() {
    const posts = await getPosts()
    const rawTags = getRawTags(posts)
    return rawTags.map(rawTag => {
      const postsByTag = getPostByTag(posts, rawTag)
      const path = rawTag?.toLowerCase()
      const pagingPosts = createPagingPosts(postsByTag, { pageSize, pathPrefix: `/tags/${path}/` })
      return ({ params: { name: rawTag, path, ...pagingPosts[0], total: pagingPosts.length } })
    })
  }
}
