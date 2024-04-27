import { pageSize } from "../shared/common"
import { createPagingPosts, getPosts } from "../shared/posts"

export async function getPostsPaths() {
  const posts = await getPosts()
  const pagingPosts = createPagingPosts(posts, { pageSize, pathPrefix: '/posts/' })
  const result = pagingPosts.map((item) => ({ params: { ...item, total: pagingPosts.length } }))
  return result
}