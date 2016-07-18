import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'site/demo.js',
    format: 'iife',
    plugins: [
        nodeResolve({
            jsnext: true
        }),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    dest: 'site/index.js'
};
