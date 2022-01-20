import path from 'path'
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      // preserveModules: false,
      dir: 'types',
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: false,
          declaration: true,
          declarationMap: false,
          rootDir: './src',
          outDir: 'types',
          declarationDir: 'types'
        }
      }
    })
  ]
}
