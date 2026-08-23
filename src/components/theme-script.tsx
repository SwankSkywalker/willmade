import { COLOR_SCHEME_QUERY, DARK_CLASS, THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Blocking script that sets the theme class before the browser paints.
 *
 * This is a Server Component on purpose. It is rendered once into the SSR'd
 * HTML and is never re-rendered on the client, which is the whole point: React
 * 19 (and therefore Next 16) logs a console error whenever a <script> element
 * is rendered from a *client* component, because React-inserted scripts never
 * execute in the browser. That is the error `next-themes` produces — see
 * pacocoursey/next-themes#385 and #387. Rendering the tag server-side sidesteps
 * it entirely, and we own the source, so it can carry a CSP nonce.
 *
 * Keep the body small and synchronous. It runs before first paint on every
 * document load, and anything slow here is a visible delay.
 */

// Built as a string so nothing in here is bundled, transpiled or tree-shaken.
// Every value is interpolated via JSON.stringify so the constants stay the
// single source of truth and the output is always valid JS.
const THEME_SCRIPT = `(function(){try{` +
  `var d=document.documentElement;` +
  `var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});` +
  `var m=window.matchMedia(${JSON.stringify(COLOR_SCHEME_QUERY)}).matches;` +
  `var dark=s===${JSON.stringify("dark")}||((s===null||s===${JSON.stringify("system")})&&m);` +
  `d.classList.toggle(${JSON.stringify(DARK_CLASS)},dark);` +
  `d.style.colorScheme=dark?"dark":"light";` +
  `}catch(e){}})();`;

interface ThemeScriptProps {
  /**
   * CSP nonce. Pass the per-request nonce here once a Content-Security-Policy
   * is in place, so `script-src` never needs 'unsafe-inline'.
   */
  nonce?: string;
}

export function ThemeScript({ nonce }: ThemeScriptProps) {
  return (
    <script
      nonce={nonce}
      // The script mutates <html> before React hydrates, so the class it adds
      // is legitimately absent from the server markup React compares against.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
