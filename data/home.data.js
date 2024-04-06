import fs from 'node:fs'

export default {
  watch: ['../src/*.md'],
  load(watchedFiles) {
    // watchFiles 是一个所匹配文件的绝对路径的数组。
    // 生成一个博客文章元数据数组
    // 可用于在主题布局中呈现列表。
    console.log('watchedFiles')
    console.log(watchedFiles)
    return watchedFiles.map((file) => {
      const result = fs.readFileSync(file, 'utf-8')
      return result
    })
  }
}