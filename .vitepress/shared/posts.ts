import { orderBy } from "lodash-es";
import fs from "node:fs"
import path from "node:path"
import fg from "fast-glob"
import matter from "gray-matter"
import { createDescription, getFileName } from "./utils";

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
  console.log('result[result.length - 1]')
  console.log(result[result.length - 1])
  return result
}

export async function getPosts() {
  const rawPosts = await getRawPosts()
  return orderBy(rawPosts, ({ date }) => date || '', ['desc'])
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
