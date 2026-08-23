import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Willmade",
  description: "Your Will, Made.",
  // Tells the browser both themes are supported, so native UI and the
  // pre-hydration paint pick the right one.
  other: { "color-scheme": "light dark" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must run before first paint, so it goes in <head> and stays
            server-rendered. See the note in theme-script.tsx. */}
        <ThemeScript />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider>
          {/* Skip link — first focusable thing on the page, visible only
              when focused. Targets the <main> below. */}
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to content
          </a>

          <div className="relative flex min-h-dvh flex-col bg-background">
            <SiteHeader />
            <main id="content" className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
