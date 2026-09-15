"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import { THEMES, type Theme } from "@/lib/theme";

const LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* `relative` matters: the Moon below is absolutely positioned, and
            without it the icon anchors to the sticky header instead. */}
        <Button variant="ghost" className="relative w-10 px-0">
          <Sun
            aria-hidden="true"
            className="h-4 w-4 rotate-0 scale-100 transition-all motion-reduce:transition-none dark:-rotate-90 dark:scale-0"
          />
          <Moon
            aria-hidden="true"
            className="absolute h-[1.2rem] w-[1.2rem] -rotate-90 scale-0 transition-all motion-reduce:transition-none dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">
            {/* Announce the state, not just the control. Until hydration
                settles, resolvedTheme is undefined — say less rather than lie. */}
            {resolvedTheme
              ? `Change theme, currently ${LABELS[theme].toLowerCase()}`
              : "Change theme"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* A radio group, because exactly one of the three is always active —
            checkbox-style items would misreport that to screen readers. */}
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          {THEMES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {LABELS[option]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
