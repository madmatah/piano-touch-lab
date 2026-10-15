import { ThemeProvider as NextThemeProvider } from 'next-themes';

/**
 * Where the chosen theme is kept. Shared with the inline script in
 * `src/index.html`, which reads it before the first paint so a reader who
 * picked the dark workshop never gets a flash of paper white.
 */
export const THEME_STORAGE_KEY = 'ptl.theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    storageKey={THEME_STORAGE_KEY}
  >
    {children}
  </NextThemeProvider>
);
