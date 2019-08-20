import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const devMode = process.env.BUILD === 'dev'
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
    const page = commandLineArgs.openFile || 'index.html'
    
    let plugins = () => [
      babel(babelrc()),
      nodeResolve({ jsnext: true, main: true })
    ];

    const devPlugins = () => plugins().concat([
      serve({
          contentBase: ['..', '.'],
          open: true,
          openPage: `/examples/${page}`,
          host: 'localhost',
          port: 8080
      }),
      livereload({
          watch: ['build', 'examples']
      })
    ]);

    const pkgInfo = require(`${process.cwd()}/package.json`)
    if(!pkgInfo) {
      throw Error('Expected build to be triggered from directory containing package.json')
    }
    let name = pkgInfo.name
    if(!name) {
      throw Error('Expected package.json to contain `name` field')
    }
    name = name.replace('@d3fc/', '')

    if(devMode && !commandLineArgs.openFile) {
      console.log('Did you know, you can specify an example to start using')
      console.log('\x1b[30m\x1b[47m%s\x1b[0m', '\t-- --openFile="<example.html>" ?'); 
    }

    return {
      input: 'index.js', 
      plugins: devMode ? devPlugins() : plugins(),
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