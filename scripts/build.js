import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import minimist from 'minimist'
import pc from 'picocolors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.resolve(__dirname, '../dist')
const resolve = p => path.resolve(distDir, p)
const argv = minimist(process.argv.slice(2))

// use pnpm build -v 0.1.x
run(argv)

// 格式化构建时间显示
function formatBuildTime(ms) {
  if (ms < 1000) return pc.green(`${ms}ms`)
  if (ms < 5000) return pc.yellow(`${(ms / 1000).toFixed(1)}s`)
  return pc.red(`${(ms / 1000).toFixed(1)}s`)
}

// 静默执行包装器，收集构建信息
async function execaQuiet(command, args = [], options = {}) {
  const startTime = Date.now()
  try {
    const result = await execa(command, args, options)
    const duration = Date.now() - startTime
    return { success: true, duration, command, args, result }
  }
  catch(error) {
    const duration = Date.now() - startTime
    return { success: false, duration, command, args, error }
  }
}

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

  try {
    console.log(pc.dim('Building TypeScript...'))
    const tscResult = await execaQuiet('tsc')

    if (fs.existsSync(distDir)) {
      await fs.remove(distDir)
    }

    console.log(pc.dim('Building bundles...'))

    // 并行执行所有 rollup 构建
    const [cjsResult, esmResult, umdResult] = await Promise.all([
      execaQuiet('rollup', ['-c', 'rollup.config.ts', '--environment', 'CJS', '--configPlugin', '@rollup/plugin-typescript']),
      execaQuiet('rollup', ['-c', 'rollup.config.ts', '--environment', 'ESM', '--configPlugin', '@rollup/plugin-typescript']),
      execaQuiet('rollup', ['-c', 'rollup.config.ts', '--configPlugin', '@rollup/plugin-typescript'])
    ])

    // 显示构建结果
    console.log(pc.dim('Build Results:'))

    // TypeScript 编译结果
    if (tscResult.success) {
      console.log(pc.green('✓') + pc.dim(' TypeScript compiled in ') + formatBuildTime(tscResult.duration))
    }
    else {
      console.log(pc.red('✗') + pc.dim(' TypeScript failed in ') + formatBuildTime(tscResult.duration))
      throw tscResult.error
    }

    // CJS 构建结果
    if (cjsResult.success) {
      console.log(pc.green('✓') + pc.dim(' CJS bundle built in ') + formatBuildTime(cjsResult.duration))
    }
    else {
      console.log(pc.red('✗') + pc.dim(' CJS bundle failed in ') + formatBuildTime(cjsResult.duration))
      throw cjsResult.error
    }

    // ESM 构建结果
    if (esmResult.success) {
      console.log(pc.green('✓') + pc.dim(' ESM bundle built in ') + formatBuildTime(esmResult.duration))
    }
    else {
      console.log(pc.red('✗') + pc.dim(' ESM bundle failed in ') + formatBuildTime(esmResult.duration))
      throw esmResult.error
    }

    // UMD 构建结果
    if (umdResult.success) {
      console.log(pc.green('✓') + pc.dim(' UMD bundle built in ') + formatBuildTime(umdResult.duration))
    }
    else {
      console.log(pc.red('✗') + pc.dim(' UMD bundle failed in ') + formatBuildTime(umdResult.duration))
      throw umdResult.error
    }

    const strPackage = JSON.stringify(packageJson, null, 2)
    fs.writeFile(resolve('./package.json'), strPackage)
    await fs.copy('README.md', resolve('README.md'))

    // 格式化打包后的代码和类型文件
    console.log(pc.dim('Formatting output files...'))
    try {
      await execa('npx', [
        'eslint',
        'dist/**/*.{js,ts,d.ts}',
        '--fix',
        '--no-ignore'
      ], { stdio: 'inherit' })
      console.log(pc.green('✓') + pc.dim(' Files formatted successfully!'))
    }
    catch(error) {
      console.log(pc.yellow('⚠') + pc.dim(' Warning: Some files could not be formatted: ') + pc.red(error.message))
    }

    console.log(pc.green('✓') + pc.bold(' Build completed successfully!'))
  }
  catch(error) {
    console.log(pc.red('✗') + pc.bold(' Build failed: ') + pc.red(error.message))
    process.exit(1)
  }
}
