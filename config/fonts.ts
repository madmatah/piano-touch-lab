/**
 * The webfonts the interface is built on, served as plain files from `/fonts/`.
 *
 * They are self-hosted rather than fetched from a CDN: Piano Touch Lab promises
 * that nothing leaves the browser, and a webfont request would hand the
 * visitor's IP address to a third party on every page load.
 *
 * They are also kept out of the bundle. Bun inlines any `url()` a stylesheet
 * references as a base64 data URI, which would push ~400 kB of fonts into the
 * render-blocking stylesheet and defeat the `unicode-range` splitting that stops
 * a French or English reader from ever downloading the Cyrillic cut. Copying the
 * files to `dist/fonts/` instead keeps the stylesheet small and the fonts
 * separately cacheable.
 *
 * Only the Latin cuts of the weight axis are shipped. `styles/fonts.css`
 * declares one `@font-face` per file listed here; the two must stay in step.
 */

const FONTSOURCE_FILES = [
  'hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2',
  'hanken-grotesk/files/hanken-grotesk-latin-ext-wght-normal.woff2',
  'newsreader/files/newsreader-latin-wght-normal.woff2',
  'newsreader/files/newsreader-latin-ext-wght-normal.woff2',
  'newsreader/files/newsreader-latin-wght-italic.woff2',
  'newsreader/files/newsreader-latin-ext-wght-italic.woff2',
  'jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  'jetbrains-mono/files/jetbrains-mono-latin-ext-wght-normal.woff2',
] as const;

export interface FontAsset {
  /** Absolute path of the file inside `node_modules`. */
  sourcePath: string;
  /** Path the browser requests, matching the `url()` in `styles/fonts.css`. */
  publicPath: string;
}

export const fontAssets = (): FontAsset[] =>
  FONTSOURCE_FILES.map((file) => {
    const specifier = `@fontsource-variable/${file}`;
    return {
      publicPath: `/fonts/${file.slice(file.lastIndexOf('/') + 1)}`,
      sourcePath: Bun.resolveSync(specifier, import.meta.dir),
    };
  });
