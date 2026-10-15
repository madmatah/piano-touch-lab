import { serve } from 'bun';
import index from './index.html';
import { fontAssets } from '../config/fonts';

/**
 * In production the webfonts are copied to `dist/fonts/` by the build; in
 * development they are served straight out of `node_modules`, so that
 * `styles/fonts.css` can point at the same `/fonts/…` URLs either way.
 */
const fontRoutes = Object.fromEntries(
  fontAssets().map((font) => [
    font.publicPath,
    new Response(Bun.file(font.sourcePath)),
  ]),
);

const server = serve({
  development: process.env.NODE_ENV !== 'production' && {
    // Echo console logs from the browser to the server
    console: true,
    // Enable browser hot reloading in development
    hmr: true,
  },
  routes: {
    ...fontRoutes,
    // Serve index.html for all unmatched routes.
    '/*': index,
  },
});

// eslint-disable-next-line no-console
console.log(`🚀 Server running at ${server.url}`);
