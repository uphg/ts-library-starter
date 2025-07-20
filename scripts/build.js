import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { fileURLToPath } from 'url';
import minimist from 'minimist'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const path = require('path')
// const execa = require('execa')
// const fs = require('fs-extra')

const distDir = path.resolve(__dirname, '../dist')
const resolve = (p) => path.resolve(distDir, p)
const argv = minimist(process.argv.slice(2));

// use pnpm build -v 0.1.x
run(argv)

async function run(argv) {
  const { v: version = '0.1.6' } = argv
  const packageJson = {
    name: 'utils',
    version,
    license: 'MIT',
    main: 'index.umd.js',
    module: 'index.js',
    types: 'index.d.js',
    description: 'A javascript function collection library',
    keywords: ['javascript', 'array', 'object', 'function', 'methods'],
    homepage: 'https://github.com/uphg/utils#readme',
    repository: 'uphg/utils',
    bugs: 'uphg/utils/issues',
    author: 'Lv Heng <lvheng233@gmail.com>'
  }

  await execa('tsc')
  if (fs.existsSync(distDir)) {
    await fs.remove(distDir)
  }

  await execa('rollup', ['-c', 'rollup.config.ts', '--environment', 'CJS', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('rollup', ['-c', 'rollup.config.ts', '--environment', 'ESM', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('rollup', ['-c', 'rollup.config.ts', '--configPlugin', '@rollup/plugin-typescript'])
  const strPackage = JSON.stringify(packageJson, null, 2)
  fs.writeFile(resolve('./package.json'), strPackage)
  await fs.copy('README.md', resolve('README.md'))
  console.log('build ok!')
}
