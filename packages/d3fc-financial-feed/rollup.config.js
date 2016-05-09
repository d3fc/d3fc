import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_financial_feed',
    format: 'umd',
    plugins: [ babel() ],
    dest: 'build/d3fc-financial-feed.js',
    globals: {
        'd3-request': 'd3_request'
    }
};
