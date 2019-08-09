import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import babelrc from 'babelrc-rollup';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

let pkg = require('./package.json');

const plugins = [
    nodeResolve({ jsnext: true, main: true }),
    babel(babelrc()),
    serve({
        contentBase: ['.', 'build'],
        open: true,
        openPage: '/examples/index.html',
        host: 'localhost',
        port: 8080
    }),
    livereload({
        watch: ['build', 'examples']
    })
];

export default {
    input: 'index.js',
    plugins: plugins,
    external: (key) => key.indexOf('d3-') === 0,
    output: {
        file: pkg.main,
        format: 'umd',
        name: 'fc',
        globals: (key) => {
            if(key.indexOf('d3-') === 0) {
                return 'd3'
            }
        },
    },
    // There are circular dependencies in d3, https://github.com/d3/d3-interpolate/issues/58
    // Don't pollute the build with other modules errors
    onwarn: (warning, rollupWarn) => {
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.indexOf('d3-') !== -1) {
            return
        }
        
        rollupWarn(warning);
      }
};
