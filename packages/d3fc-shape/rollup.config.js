import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_shape',
    format: 'umd',
    plugins: [ babel() ],
    dest: 'build/d3fc-shape.js',
    globals: {
        'd3': 'd3',
        'd3-path': 'd3_path'
    }
};
