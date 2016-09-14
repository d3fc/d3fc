module.exports = function(globals = {}) {
    return function(key) {
        if (globals[key]) {
            return globals[key];
        }
        if (key.indexOf('d3-') === 0) {
            return 'd3';
        }
        if (key.indexOf('d3fc-') === 0) {
            return 'fc';
        }
    };
};
