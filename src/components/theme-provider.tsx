"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  COLOR_SCHEME_QUERY,
  DARK_CLASS,
  THEME_STORAGE_KEY,
  isTheme,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

interface ThemeContextValue {
  /** What the user chose: "light", "dark", or "system". */
  theme: Theme;
  /** What is actually on screen. `undefined` until after hydration. */
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Suppress transitions and animations for one frame so switching themes is an
 * instant cut rather than every transitioned property racing at once. This is
 * the equivalent of next-themes' `disableTransitionOnChange`.
 */
function withoutTransitions(mutate: () => void) {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important;animation:none!important}"
    )
  );
  document.head.appendChild(style);

  mutate();

  // Force a reflow so the class change is committed while transitions are
  // still suppressed. Reading a layout property is what flushes the style.
  void window.getComputedStyle(document.body).opacity;

  document.head.removeChild(style);
}

function resolve(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";
  }
  return theme;
}

function paint(theme: Theme, animate: boolean): ResolvedTheme {
  const resolved = resolve(theme);

  const mutate = () => {
    const root = document.documentElement;
    root.classList.toggle(DARK_CLASS, resolved === "dark");
    // Keeps native UI — scrollbars, form controls, the URL bar — in step.
    root.style.colorScheme = resolved;
  };

  if (animate) {
    mutate();
  } else {
    withoutTransitions(mutate);
  }

  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start at "system" so the server and the first client render agree.
  // The real value is adopted in the effect below, after hydration.
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>();

  // Adopt whatever <ThemeScript /> already decided. It has run long before
  // this point, so we read the DOM rather than recomputing and risking a flash.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // Private mode, or storage blocked. "system" is a fine fallback.
    }

    setThemeState(isTheme(stored) ? stored : "system");
    setResolvedTheme(
      document.documentElement.classList.contains(DARK_CLASS) ? "dark" : "light"
    );
  }, []);

  // Follow the OS for as long as the user is on "system".
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia(COLOR_SCHEME_QUERY);
    const onChange = () => setResolvedTheme(paint("system", false));

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Choice won't survive a reload, but the current page still switches.
    }
    setThemeState(next);
    setResolvedTheme(paint(next, false));
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be called inside <ThemeProvider>");
  }
  return context;
}
