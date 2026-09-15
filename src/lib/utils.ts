import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "#site/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The zone real timestamps are displayed in. Fixed on purpose: a commit time
 * should read the same to every visitor, and it should match the clock you were
 * actually looking at when you hit save.
 */
const DISPLAY_TIME_ZONE = "America/Los_Angeles";

/**
 * Format a calendar date from post frontmatter.
 *
 * Velite's `s.isodate()` stores `date: 2026-08-13` as the instant
 * `2026-08-13T00:00:00.000Z` — UTC midnight. Reading that back with
 * `toLocaleDateString` and no `timeZone` renders it in whatever zone the
 * *rendering machine* happens to be in. Anywhere west of Greenwich, UTC
 * midnight is still the previous evening, so the date comes out a day early.
 *
 * That is why this page showed "August 12, 2026" on your Mac (PDT) and
 * "August 13, 2026" on Vercel (UTC) from identical source. Pinning the
 * formatter to UTC reads the value back in the same zone it was written in,
 * so the calendar date you typed is the calendar date that renders — on every
 * machine, in every reader's browser.
 *
 * Use this for `post.date`. For real instants, use `formatTimestamp`.
 */
export function formatDate(input: string | number): string {
  return new Date(input).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Format a genuine point in time — currently `post.lastEdited`, which comes
 * from `git log` and carries a real offset (e.g. `2026-01-10T16:22:34-08:00`).
 *
 * Deliberately NOT UTC. That commit is 00:22 on the 11th in UTC, so formatting
 * it there would report an evening edit as the following day. Pin it to the
 * zone you work in instead.
 */
export function formatTimestamp(input: string | number): string {
  return new Date(input).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
  });
}

/**
 * Newest first. Copies before sorting — `Array.prototype.sort` mutates, and
 * `posts` is a shared module-level import from Velite.
 */
export function sortPosts(posts: Array<Post>) {
  return [...posts].sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
}
