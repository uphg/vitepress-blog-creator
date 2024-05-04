import { orderBy } from "lodash-es";
import fs from "node:fs"
import path from "node:path"
import fg from "fast-glob"
import matter from "gray-matter"
import { createDescription, getFileName } from "./utils";

let cachedPosts: any[] = []

export function createPagingPosts(posts, { pageSize = 10, pathPrefix = '/' }) {
  const result: any[] = []
  const pageCount = Math.ceil(posts.length / pageSize)
  let index = -1
  while (++index < pageCount) {
    const start = pageSize * index
    const items = posts.slice(start, start + pageSize)
    const page = index + 1
    const next = page - 1 <= 0 ? null : `${pathPrefix}${page - 1}/`
    const prev = page + 1 > pageCount ? null : `${pathPrefix}${page + 1}/`
    result.push({ page: index + 1, next, prev, items })
  }
  return result
}

export async function getPosts() {
  if (cachedPosts.length) return cachedPosts

  const rawPosts = await getRawPosts()
  cachedPosts = orderBy(rawPosts, ({ date }) => date || '', ['desc'])
  return cachedPosts
}

export async function getRawPosts(pathPrefix = '/post/') {
  const filePaths = await fg(["src/post/**/*.md"])
  const posts: any[] = []
  filePaths.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    const fileName = getFileName(fullPath)
    const text = fs.readFileSync(fullPath, "utf-8")
    const { data, content } = matter(text)
    const description = data?.description ?? createDescription(content)
    const post = {
      ...data,
      description,
      filePath: fullPath,
      to: `${pathPrefix}${fileName}`,
    }
    posts.push(post)
  })

  return posts
}

export async function getPrevOrNext(filePath) {
  const posts = await getPosts()
  const currentIndex = posts.findIndex(item => {
    const to = item.to?.replace(/^\//, '')
    const path = filePath?.replace(/\.md$/, '')
    return to === path
  })

  const prev = currentIndex > 0 ? posts[currentIndex - 1] : void 0
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : void 0

  return {
    prev: prev ? {
      text: prev?.title,
      link: prev.to
    } : void 0,
    next: next ? {
      text: next?.title,
      link: next.to
    } : void 0
  }
}
