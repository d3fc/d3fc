import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_layout',
    format: 'umd',
    plugins: [ babel() ],
    dest: 'build/d3fc-label-layout.js',
    globals: {
        'd3': 'd3',
        'd3fc-rebind': 'fc_rebind'
    }
};
