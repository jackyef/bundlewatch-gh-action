import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'src/main.ts',
  output: {
    file: 'lib/main.js',
    format: 'cjs'
  },
  plugins: [
    // Allow json resolution
    json(),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    typescript({ 
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true,
      useTsconfigDeclarationDir: true,
    }),
  ],
};
