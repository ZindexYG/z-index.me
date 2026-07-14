import { getCollection } from 'astro:content'

export async function getBlogPosts() {
  const posts = await getCollection('posts')

  return posts.map((post) => {
    const fileName = post.id.split('/').pop()
    const datePart = fileName?.split('.')[0] ?? '2001-08-06'
    const blog_slug = post.id.split('/')[0]

    return {
      ...post,
      blog_slug,
      fileName: datePart,
      title: post.data.title,
    }
  })
}
