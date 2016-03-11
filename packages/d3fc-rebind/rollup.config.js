import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_rebind',
    format: 'umd',
    plugins: [ babel() ],
    dest: 'build/d3fc-rebind.js'
};
