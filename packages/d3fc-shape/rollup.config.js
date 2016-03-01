import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  format: 'cjs',
  plugins: [ json(), babel() ],
  dest: 'build/d3fc-path.js'
};
