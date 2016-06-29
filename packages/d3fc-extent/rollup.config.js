import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_extent',
    format: 'umd',
    plugins: [ babel({
        babelrc: false,
        presets: ['es2015-rollup']
    })],
    dest: 'build/d3fc-extent.js',
    globals: {
        'd3-array': 'd3_array'
    }
};
