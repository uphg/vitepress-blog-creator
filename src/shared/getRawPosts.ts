import * as fs from "node:fs"
import * as path from "node:path"
import * as fg from "fast-glob"
import * as matter from "gray-matter"
import { createDescription } from "./createDescription"

export async function getRawPosts() {
  const filePaths = await fg(["content/post/**/*.md"])
  const posts = []
  filePaths.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    const fileName = getFileName(fullPath)
    const text = fs.readFileSync(fullPath, "utf-8")
    const { data, content } = matter(text)

    const description = data?.description ?? createDescription(content)
    
    const post = {
      ...data,
      source: fullPath,
      fileName,
      description,
    }
    posts.push(post)
  })

  return posts
}

function getFileName(path) {
  const names = path.split(/(\\)|(\/)/)
  const fileName = names[names.length - 1]
  return fileName.replace(/\.md$/g, "")
}