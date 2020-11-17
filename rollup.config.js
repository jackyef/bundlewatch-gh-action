import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript'; // we use 3.1.1 because of https://github.com/rollup/plugins/issues/287#issuecomment-645100737
import json from '@rollup/plugin-json';
import importResolver from 'rollup-plugin-import-resolver';
import path from 'path';

const nodeModulesDir = path.resolve(__dirname, 'node_modules');

export default {
  input: 'src/main.ts',
  output: {
    file: 'lib/main.js',
    format: 'cjs',
  },
  plugins: [
    // Allow json resolution
    json(),

    importResolver({
      // a list of file extensions to check, default = ['.js']
      extensions: ['.js'],
      // a list of aliases, default = {}
      alias: {
        // force use modern tslib
        'tslib': 'tslib.es6.js',
      },
      // index file name without extension, default = 'index'
      indexFile: 'index',
      // path to node_modules dir, default = ./node_modules
      modulesDir: './node_modules',
    }),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      mainFields: ['main', 'module'],
      preferBuiltins: true, // prefer native node modules
    }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    typescript({
      typescript: require('typescript'),
      // objectHashIgnoreUnknownHack: true,
      // useTsconfigDeclarationDir: true,
    }),
  ],
};
