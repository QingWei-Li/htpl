// rollup.config.js
import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/index.ts',

  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ],

  output: [
    {
      file: 'dist/htpl.js',
      format: 'umd',
      name: 'Htpl'
    },
    {
      file: 'dist/htpl.common.js',
      format: 'cjs'
    }
  ]
};
