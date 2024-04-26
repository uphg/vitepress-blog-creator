export function getPagingPosts(posts, pageSize = 10) {
  const result = []
  const pageCount = Math.ceil(posts.length / pageSize)
  let index = -1
  while (++index < pageCount) {
    const start = pageSize * index
    const items = posts.slice(start, start + pageSize)
    const page = index + 1
    const next = page - 1 <= 0 ? null : page - 1
    const prev = page + 1 > pageCount ? null : page + 1
    result.push({ page: index + 1, next, prev, items })
  }
  return result
}