import MarkdownIt from 'markdown-it'

const reFilterTag = /<(\/)?[^>]+>/g

export function createDescription(value: string) {
  if (!value) return ''
  // 中文 [\u4e00-\u9fa5]，双字节字符 [^\x00-\xff]
  const md = new MarkdownIt()
  const content = md.render(value).replace(reFilterTag, '').replace(/\n/g, ' ')
  return content.slice(0, 160)
}
