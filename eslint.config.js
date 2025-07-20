import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'docs/.vitepress/cache/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // js/ts
      indent: ['error', 2, { 'SwitchCase': 1 }],
      quotes: ['error', 'single', { 'avoidEscape': true }],
      'comma-dangle': ['error', 'never'],
      // 禁止特定语法
      'no-restricted-syntax': [
        'error',
        'WithStatement'
      ],
      camelcase: 'error',
      'no-var': 'error',
      'no-empty': 'error',
      'prefer-const': [
        'warn',
        { destructuring: 'all' }
      ],
      'prefer-template': 'error',
      'object-shorthand': 'off',
      'no-constant-condition': 'error',
      'space-before-function-paren': ['error', 'never'],
      'no-multi-spaces': ['error', { ignoreEOLComments: true }],
      'no-dupe-args': 'error',
      'key-spacing': ['error', { 'afterColon': true }],
      'keyword-spacing': ['error', { 'before': true }],
      'eol-last': ['error', 'always'],
      'no-case-declarations': 'off',
      'prefer-spread': 'off',
      'prefer-rest-params': 'off',
      'no-undef': 'off',

      // TS
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  }
]
