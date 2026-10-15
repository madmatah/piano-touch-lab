import { transformAsync } from '@babel/core';
import reactCompiler from 'babel-plugin-react-compiler';
import type { BunPlugin } from 'bun';
import path from 'path';

const SOURCES = path.resolve(import.meta.dir, '../src') + path.sep;
/** The domain holds no React code, and its classes carry decorators. */
const LEFT_OUT = [path.join(SOURCES, 'lib') + path.sep];

const isCompiled = (file: string) =>
  file.startsWith(SOURCES) &&
  !LEFT_OUT.some((folder) => file.startsWith(folder)) &&
  !/\.test\.tsx?$/.test(file);

/**
 * Runs the React Compiler over the components and hooks of `src/`.
 *
 * Bun's transpiler does not know the compiler, so Babel is put in front of it
 * for those files: it parses the TypeScript and the JSX, lets the compiler
 * memoize what each render computes, and hands back TypeScript for Bun to
 * finish. A component the compiler cannot prove safe is left as it is. Every
 * other file goes on to Bun untouched.
 *
 * Bun takes no source map from a plugin, so the maps of those files show the
 * compiled code — the `$[0] !== …` checks — rather than the source.
 */
export const reactCompilerPlugin: BunPlugin = {
  name: 'react-compiler',
  setup(build) {
    build.onLoad({ filter: /\/src\/.*\.tsx?$/ }, async ({ path: file }) => {
      if (!isCompiled(file)) {
        return undefined;
      }
      const source = await Bun.file(file).text();
      const compiled = await transformAsync(source, {
        babelrc: false,
        configFile: false,
        filename: file,
        parserOpts: { plugins: ['typescript', 'jsx'] },
        plugins: [reactCompiler],
      });
      return {
        contents: compiled?.code ?? source,
        loader: file.endsWith('x') ? 'tsx' : 'ts',
      };
    });
  },
};

export default reactCompilerPlugin;
