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
  dayOfMonth: number;
}

export interface MonthData {
  month: number; // 0-11
  monthName: string;
  year: number;
  weeks: (DayActivity | null)[][]; // Array of weeks, each week is 7 days
}

export interface YearData {
  year: number;
  months: MonthData[];
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Get the number of days in a month
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Generate activity grid for a specific month
 */
export function generateMonthGrid(
  year: number,
  month: number,
  posts: CollectionEntry<"posts">[]
): MonthData {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Group posts by date
  const postsByDate = new Map<string, PostMetadata[]>();

  posts.forEach((post) => {
    const postDate = new Date(post.data.date);
    if (postDate.getFullYear() !== year || postDate.getMonth() !== month) return;

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

  // Create calendar grid
  const weeks: (DayActivity | null)[][] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = getDayOfWeek(firstDay);

  let currentWeek: (DayActivity | null)[] = [];

  // Fill empty days before month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Fill days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = date.toISOString().split("T")[0];
    const postsForDay = postsByDate.get(dateKey) || [];

    currentWeek.push({
      date,
      posts: postsForDay,
      count: postsForDay.length,
      dayOfMonth: day,
    });

    // If week is complete, start a new one
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining days to complete the last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return {
    month,
    monthName: monthNames[month],
    year,
    weeks,
  };
}

/**
 * Generate activity grid for a specific year (all months)
 */
export function generateYearGrid(
  year: number,
  posts: CollectionEntry<"posts">[]
): YearData {
  const months: MonthData[] = [];

  // Generate all 12 months in reverse order (latest first)
  for (let month = 11; month >= 0; month--) {
    months.push(generateMonthGrid(year, month, posts));
  }

  return { year, months };
}

/**
 * Get all years and months that have posts
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
