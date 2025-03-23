import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    description: z.string().optional(),
    readingTime: z.string().optional(),
    components: z.record(z.string()).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};