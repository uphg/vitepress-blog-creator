import { data } from '../../src/data/posts.data'
export default {
  paths: () => data.map((item, index) => ({ params: { page: index, posts: item } }))
}