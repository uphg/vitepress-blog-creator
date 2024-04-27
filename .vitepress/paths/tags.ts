import { pageSize } from "../shared/common"
import { createPagingPosts, getPosts } from "../shared/posts"
import { getPostByTag, getRawTags } from "../shared/tags"

export async function getPostsByTagPaths() {
  const posts = await getPosts()
  const rawTags = getRawTags(posts)
  const result: any[] = []
  for (const tag of rawTags) {
    const path = tag.toLowerCase()
    const postsByTag = getPostByTag(posts, tag)
    const pagingPosts = createPagingPosts(postsByTag, { pageSize, pathPrefix: `/tags/${path}/` })
    for (const item of pagingPosts) {
      result.push({
        params: { ...item, name: tag, path, total: pagingPosts.length }
      })
    }
  }
  return result
}