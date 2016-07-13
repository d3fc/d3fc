import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc',
    format: 'umd',
    plugins: [
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    dest: 'build/d3fc-discontinuous-scale.js',
    globals: {
        'd3fc-rebind': 'fc_rebind',
        'd3-scale': 'd3_scale',
        'd3-time': 'd3_time'
    }
};
