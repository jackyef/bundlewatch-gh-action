import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
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

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      mainFields: ['main', 'module'],
      preferBuiltins: true, // prefer native node modules
    }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    typescript(),
  ],
};
