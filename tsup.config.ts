// tsup.config.ts

import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    target: 'node16',
  },
  {
    entry: ['src/browser.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    outDir: 'dist',
    target: 'es2018',
  }
])