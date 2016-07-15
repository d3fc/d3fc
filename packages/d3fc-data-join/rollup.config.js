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
    dest: 'build/d3fc-data-join.js',
    globals: {
        'd3-selection': 'd3',
        'd3-transition': 'd3'
    }
};
