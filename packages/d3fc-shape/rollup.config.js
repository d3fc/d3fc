import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  moduleName: 'fc_path',
  format: 'umd',
  plugins: [ babel() ],
  dest: 'build/d3fc-path.js',
  globals: {
    d3: 'd3'
  }
};
