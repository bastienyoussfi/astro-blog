import type { CollectionEntry } from "astro:content";

export interface PostMetadata {
  slug: string;
  title: string;
  description?: string;
  date: Date;
  image?: string;
  type: "blog" | "learn" | "project";
}

export interface DayActivity {
  date: Date;
  posts: PostMetadata[];
  count: number;
}

export interface WeekData {
  days: (DayActivity | null)[];
}

export interface YearData {
  year: number;
  weeks: WeekData[];
  monthLabels: { month: string; weekIndex: number }[];
}

/**
 * Get the week number of a date (0-52)
 */
function getWeekNumber(date: Date): number {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(days / 7);
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Generate activity grid for a specific year
 */
export function generateYearGrid(
  year: number,
  posts: CollectionEntry<"posts">[]
): YearData {
  // Initialize 53 weeks × 7 days grid
  const weeks: WeekData[] = Array.from({ length: 53 }, () => ({
    days: Array(7).fill(null),
  }));

  // Group posts by date
  const postsByDate = new Map<string, PostMetadata[]>();

  posts.forEach((post) => {
    const postDate = new Date(post.data.date);
    if (postDate.getFullYear() !== year) return;

    const dateKey = postDate.toISOString().split("T")[0];

    if (!postsByDate.has(dateKey)) {
      postsByDate.set(dateKey, []);
    }

    postsByDate.get(dateKey)!.push({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      date: postDate,
      image: post.data.image,
      type: post.data.type,
    });
  });

  // Fill the grid with activity data
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getFullYear() !== year || date.getMonth() !== month) continue;

      const weekIndex = getWeekNumber(date);
      const dayIndex = getDayOfWeek(date);
      const dateKey = date.toISOString().split("T")[0];

      const postsForDay = postsByDate.get(dateKey) || [];

      weeks[weekIndex].days[dayIndex] = {
        date,
        posts: postsForDay,
        count: postsForDay.length,
      };
    }
  }

  // Generate month labels
  const monthLabels: { month: string; weekIndex: number }[] = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let month = 0; month < 12; month++) {
    const firstDayOfMonth = new Date(year, month, 1);
    const weekIndex = getWeekNumber(firstDayOfMonth);
    monthLabels.push({ month: monthNames[month], weekIndex });
  }

  return { year, weeks, monthLabels };
}

/**
 * Get all years that have posts
 */
export function getYearsWithPosts(posts: CollectionEntry<"posts">[]): number[] {
  const years = new Set<number>();

  posts.forEach((post) => {
    const year = new Date(post.data.date).getFullYear();
    years.add(year);
  });

  // Sort in descending order (newest first)
  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Generate activity data for all years
 */
export function generateActivityData(
  posts: CollectionEntry<"posts">[]
): YearData[] {
  const years = getYearsWithPosts(posts);
  return years.map((year) => generateYearGrid(year, posts));
}

/**
 * Format date for display
 */
export function formatActivityDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
