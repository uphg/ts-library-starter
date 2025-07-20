import pc from 'picocolors'
import { execa } from 'execa'

// 构建类型常量
export const BUILD_TYPES = {
  TSC: { name: 'TypeScript', type: 'compiled' },
  CJS: { name: 'CJS', type: 'bundle built' },
  ESM: { name: 'ESM', type: 'bundle built' },
  UMD: { name: 'UMD', type: 'bundle built' }
}

/**
 * 格式化构建时间显示
 * @param {number} ms - 毫秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatBuildTime(ms) {
  if (ms < 1000) return pc.green(`${ms}ms`)
  if (ms < 5000) return pc.yellow(`${(ms / 1000).toFixed(1)}s`)
  return pc.red(`${(ms / 1000).toFixed(1)}s`)
}

/**
 * 静默执行包装器，收集构建信息
 * @param {string} command - 要执行的命令
 * @param {string[]} args - 命令参数
 * @param {object} options - 执行选项
 * @returns {Promise<{success: boolean, duration: number, command: string, args: string[], result?: any, error?: any}>} 构建结果
 */
export async function execaQuiet(command, args = [], options = {}) {
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

/**
 * 统一处理构建结果
 * @param {Object} result - 构建结果
 * @param {string} type - 构建类型
 * @param {string} action - 构建动作
 */
export function handleBuildResult(result, type, action) {
  if (result.success) {
    console.log(pc.green('✓') + pc.dim(` ${type} ${action} in `) + formatBuildTime(result.duration))
  }
  else {
    console.log(pc.red('✗') + pc.dim(` ${type} failed in `) + formatBuildTime(result.duration))
    throw result.error
  }
}
