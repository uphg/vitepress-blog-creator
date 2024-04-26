import { orderBy } from "lodash-es";
import { ContentData } from "vitepress";
import { createDescription } from "./createDescription";

type PostsItem = {
  title: string
  data: Date | number
  tags: string[]
  description?: string
}

let posts: PostsItem[] = []

export function getPosts(rawData: ContentData[]) {
  if (posts.length) return posts
  const rawPosts = []
  for (const item of rawData) {
    const { frontmatter, html } = item
    const { description } = frontmatter
    const post = {
      ...frontmatter,
      ...(description ? {} : createDescription(html))
    }
    rawPosts.push(post)
  }
  posts = orderBy(rawPosts, ({ date }) => date || '', ['desc'])
  return posts
}