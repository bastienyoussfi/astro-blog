import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    description: z.string().optional(),
    readingTime: z.string().optional(),
    components: z.record(z.string()).optional(),
  }),
});

// NEW: Journeys collection - Master journey metadata
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

// NEW: Learn collection - Learning posts/articles
const learnCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    description: z.string(),

    // Journey organization
    journey: z.enum(["devops", "ml"]),
    category: z.string(),
    phase: z.string().optional(),

    // Progress tracking
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    estimatedTime: z.string(),
    roadmapSection: z.string().optional(),

    // Learning metadata
    tags: z.array(z.string()),
    prerequisites: z.array(z.string()).optional(),
    relatedPosts: z.array(z.string()).optional(),
    relatedProjects: z.array(z.string()).optional(),

    // Resources
    resources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(["docs", "video", "course", "article", "tool"]),
        }),
      )
      .optional(),

    // What you learned
    keyTakeaways: z.array(z.string()).optional(),

    draft: z.boolean().optional(),
  }),
});

// NEW: Projects collection
const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),

    journey: z.enum(["devops", "ml"]),
    category: z.string(),

    techStack: z.array(z.string()),
    status: z.enum(["planning", "in-progress", "completed", "archived"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),

    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    docsUrl: z.string().optional(),

    problemStatement: z.string().optional(),
    keyLearnings: z.array(z.string()),
    challenges: z.array(z.string()).optional(),
    improvements: z.array(z.string()).optional(),

    duration: z.string().optional(),
    tags: z.array(z.string()),
    relatedPosts: z.array(z.string()).optional(),

    draft: z.boolean().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  journeys: journeysCollection,
  learn: learnCollection,
  projects: projectsCollection,
};
