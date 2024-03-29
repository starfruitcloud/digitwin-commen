/**
 @author : Caven Chen
 **/

'use strict'

import fse from 'fs-extra'
import path from 'path'
import gulp from 'gulp'
import esbuild from 'esbuild'

const buildConfig = {
  bundle: true,
  color: true,
  legalComments: `inline`,
  logLimit: 0,
  target: `es2019`,
  minify: false,
  sourcemap: false,
  write: true,
  logLevel: 'info',
  external: [`http`, `https`, `url`, `zlib`],
  plugins: [],
}

async function buildNamespace(options) {
  await esbuild.build({
    ...buildConfig,
    entryPoints: ['src/index.js'],
    format: options.node ? 'esm' : 'iife',
    globalName: 'DC.__namespace',
    minify: options.minify,
    outfile: path.join('dist', options.node ? 'index.js' : '__namespace.js'),
  })
}

async function copyAssets() {
  await fse.emptyDir('dist/resources')
  await gulp
    .src('./node_modules/@cesium/engine/Build/Workers/**', { nodir: true })
    .pipe(gulp.dest('dist/resources/Workers'))
  await gulp
    .src('./node_modules/@cesium/engine/Source/Assets/**', { nodir: true })
    .pipe(gulp.dest('dist/resources/Assets'))
  await gulp
    .src('./node_modules/@cesium/engine/Source/ThirdParty/**', { nodir: true })
    .pipe(gulp.dest('dist/resources/ThirdParty'))
}

export const build = gulp.series(
  () => buildNamespace({ node: true, minify: true }),
  () => buildNamespace({ iife: true, minify: true }),
  copyAssets
)

export const buildRelease = gulp.series(
  () => buildNamespace({ node: true, minify: true }),
  () => buildNamespace({ iife: true, minify: true }),
  copyAssets
)
