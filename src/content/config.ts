import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    image: z.string().optional(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    timeEstimate: z.string().optional(),
    draft: z.boolean().optional(),
    components: z.record(z.string()).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
