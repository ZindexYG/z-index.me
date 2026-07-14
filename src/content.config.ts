import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

function removeDuplicates(array: string[]) {
  if (!array.length)
    return array

  const lowercaseItems = array.map(str => str.toLowerCase())
  return Array.from(new Set(lowercaseItems))
}

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(' '),
    pubDate: z.coerce.date(),
    image: z.string().default('/static/ogimage.png'),
    tags: z.array(z.string()).default([]).transform(removeDuplicates),
  }),
})

export const collections = { posts }
