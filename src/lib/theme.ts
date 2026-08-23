/**
 * Shared theme constants.
 *
 * Kept in one place so the server-rendered <ThemeScript /> and the client
 * <ThemeProvider /> can never disagree about the storage key or the class name.
 */

export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

/** The two states a theme can actually resolve to on screen. */
export type ResolvedTheme = "light" | "dark";

/** localStorage key holding the user's explicit choice. */
export const THEME_STORAGE_KEY = "willmade-theme";

/** Class toggled on <html>. Must match `darkMode: ["class"]` in tailwind.config.ts. */
export const DARK_CLASS = "dark";

export const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}
