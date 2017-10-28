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
      file: 'dist/umd.js',
      format: 'umd',
      name: 'Htpl'
    },
    {
      file: 'dist/cjs.js',
      format: 'cjs'
    }
  ]
};
