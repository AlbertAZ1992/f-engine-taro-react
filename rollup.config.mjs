import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import externals from 'rollup-plugin-node-externals';
import path from 'node:path';

const externalPackages = [
  'react',
  'react-dom',
  '@tarojs/components',
  '@tarojs/runtime',
  '@tarojs/taro',
  '@tarojs/react',
  '@antv/f2',
];

const projectRootDir = path.resolve(new URL('.', import.meta.url).pathname);

export default {
  input: ['src/index.ts', 'src/utils/index.ts'],
  output: [
    {
      format: 'cjs',
      dir: 'dist',
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
    },
    {
      format: 'es',
      dir: 'dist',
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].esm.js',
    },
  ],
  treeshake: false,
  plugins: [
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(projectRootDir, 'src'),
        },
      ],
    }),
    externals({
      deps: true,
      devDeps: false,
      include: externalPackages,
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    }),
    ts({
      noEmitOnError: false,
    }),
    commonjs(),
    json(),
  ],
};
