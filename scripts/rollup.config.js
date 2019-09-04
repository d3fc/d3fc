import babel from 'rollup-plugin-babel';
import babelrc from 'read-babelrc-up'
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

var external = (key) => key.indexOf('d3-') === 0 || key.indexOf('d3fc-') === 0
var globals = function(key) {
  if (key.indexOf('d3-') === 0) {
      return 'd3';
  }
  if (key.indexOf('d3fc-') === 0) {
      return 'fc'
  }
};

export default commandLineArgs => {
    process.env = commandLineArgs.configEnv || 'dev'
    const shouldMinify = process.env === 'prod'
    let plugins = [
      babel(babelrc()),
      resolve()
    ];
    if(shouldMinify) {
      plugins.push(minify({ comments: false }))
    }
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
          file: `build/${name}${shouldMinify ? '.min' : ''}.js`,
          format: 'umd',
          globals: globals,
          extend: true,
          name: 'fc',
      }
  }
};