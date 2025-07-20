import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 测试文件匹配模式
    include: ['test/**/*.{spec,test}.ts'],
    // 排除的文件
    exclude: ['node_modules/**'],
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    // 环境配置
    environment: 'node'
  }
})
