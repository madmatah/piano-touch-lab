import type { BunPlugin } from 'bun';

/**
 * Keeps the `@font-face` sources of `styles/fonts.css` out of the bundle.
 *
 * Bun resolves every `url()` a stylesheet references and inlines the result as
 * a base64 data URI, which would put ~400 kB of webfonts inside the
 * render-blocking stylesheet. The font files are instead served as plain files
 * under `/fonts/` — copied to `dist/` by `build.ts`, served from
 * `node_modules` by the dev server — so the bundler must leave those URLs
 * exactly as they are written.
 */
export const externalFontsPlugin: BunPlugin = {
  name: 'external-fonts',
  setup(build) {
    build.onResolve({ filter: /^\/fonts\// }, (args) => ({
      external: true,
      path: args.path,
    }));
  },
};

export default externalFontsPlugin;
