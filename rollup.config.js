import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript'; // we use 3.1.1 because of https://github.com/rollup/plugins/issues/287#issuecomment-645100737
import json from '@rollup/plugin-json';
import builtins from 'builtin-modules';

export default {
  input: 'src/main.ts',
  output: {
    file: 'lib/main.js',
    format: 'cjs'
  },
  external: builtins,
  plugins: [
    // Allow json resolution
    json(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    nodeResolve({
      mainFields: ['main', 'module'],
      preferBuiltins: true // prefer native node modules
    }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    typescript({
      typescript: require('typescript')
      // objectHashIgnoreUnknownHack: true,
      // useTsconfigDeclarationDir: true,
    })
  ]
};
