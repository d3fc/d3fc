import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import nodeResolve from 'rollup-plugin-node-resolve';

var external = (key) => key.indexOf('d3-') === 0 || key.indexOf('d3fc-') === 0
var globals = function(key) {
  if (key.indexOf('d3-') === 0) {
      return 'd3';
  }
  if (key.indexOf('d3fc-') === 0) {
      return 'fc'
  }
};

let plugins = [
  babel(babelrc()),
  nodeResolve({ jsnext: true, main: true })
];

export default commandLineArgs => {
    const pkgInfo = require(`${process.cwd()}/package.json`)
    if(!pkgInfo) {
      throw Error('Expected build to be triggered from directory containing package.json')
    }
    let name = pkgInfo.name
    if(!name) {
      throw Error('Expected package.json to contain `name` field')
    }
    name = name.replace('@d3fc/', '')
    return {
      input: 'index.js',
      plugins: plugins,
      external: external,
      output: {
          file: `build/${name}.js`,
          format: 'umd',
          globals: globals,
          extend: true,
          name: 'fc',
      }
  }
};