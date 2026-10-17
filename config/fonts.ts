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

/**
 * The SIL Open Font License lets the fonts be redistributed only if each copy
 * carries its copyright notice and the license itself (condition 2), so the
 * license of each family is served beside its files.
 */
const FONTSOURCE_FAMILIES = [
  ...new Set(FONTSOURCE_FILES.map((file) => file.slice(0, file.indexOf('/')))),
];

export interface FontAsset {
  /** Absolute path of the file inside `node_modules`. */
  sourcePath: string;
  publicPath: string;
}

export const listFontAssets = (): FontAsset[] => [
  ...FONTSOURCE_FILES.map((file) => ({
    publicPath: `/fonts/${file.slice(file.lastIndexOf('/') + 1)}`,
    sourcePath: Bun.resolveSync(
      `@fontsource-variable/${file}`,
      import.meta.dir,
    ),
  })),
  ...FONTSOURCE_FAMILIES.map((family) => ({
    publicPath: `/fonts/${family}-LICENSE.txt`,
    sourcePath: Bun.resolveSync(
      `@fontsource-variable/${family}/LICENSE`,
      import.meta.dir,
    ),
  })),
];
