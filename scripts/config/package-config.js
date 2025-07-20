/**
 * 生成 package.json 配置
 * @param {string} version - 版本号
 * @returns {Object} package.json 配置对象
 */
export function createPackageConfig(version = '0.1.6') {
  return {
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
}
