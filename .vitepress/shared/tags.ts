export function getRawTags(posts) {
  const tags: any[] = []
  posts.forEach((item) => {
    if (!item?.tags?.length) return
    for (const tag of item.tags) {
      if (tags.includes(tag)) continue
      tags.push(tag)
    }
  })
  return tags
}

export function getPostByTag(posts, tag) {
  const result: any[] = []
  for (const post of posts) {
    if (!post.tags?.includes(tag)) continue
    result.push(post)
  }
  return result
}