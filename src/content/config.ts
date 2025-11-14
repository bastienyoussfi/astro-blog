import { defineCollection, z } from "astro:content";

// Journeys collection - Master journey metadata
const journeysCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(), // emoji or icon name (deprecated, use slug-based icons)
    color: z.string(), // hex color for theming
    roadmapUrl: z.string().optional(),
    startDate: z.date(),
    status: z.enum(["planning", "active", "paused", "completed"]),
    goals: z.array(z.string()),
    totalTopics: z.number().optional(),
    completedTopics: z.number().default(0),
    estimatedDuration: z.string().optional(),
    tags: z.array(z.string()),
  }),
});

// Unified posts collection - All content types (blog, learn, projects)
const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Core fields (all types)
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    image: z.string().optional(),
    updatedDate: z.date().optional(),

    // Type discriminator
    type: z.enum(["blog", "learn", "project"]),

    // Journey organization (learn/project only)
    journey: z.enum(["devops", "ml"]).optional(),
    category: z.string().optional(),

    // Common metadata
    tags: z.array(z.string()).optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    timeEstimate: z.string().optional(), // Unified: was readingTime/estimatedTime/duration
    draft: z.boolean().optional(),

    // Learn-specific fields
    phase: z.string().optional(),
    roadmapSection: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
    relatedPosts: z.array(z.string()).optional(),
    relatedProjects: z.array(z.string()).optional(),
    resources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(["docs", "video", "course", "article", "tool"]),
        }),
      )
      .optional(),
    keyTakeaways: z.array(z.string()).optional(),

    // Project-specific fields
    status: z.enum(["planning", "in-progress", "completed", "archived"]).optional(),
    techStack: z.array(z.string()).optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    docsUrl: z.string().optional(),
    problemStatement: z.string().optional(),
    keyLearnings: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    improvements: z.array(z.string()).optional(),

    // Blog-specific fields
    components: z.record(z.string()).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  journeys: journeysCollection,
};
