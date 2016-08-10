module.exports = function(packageInfo) {
    var globals = {};
    for (var key in packageInfo.dependencies) {
        if (!packageInfo.dependencies.hasOwnProperty(key)) {
            continue;
        }
        if (key.indexOf('d3-') === 0) {
            globals[key] = 'd3';
        }
        if (key.indexOf('d3fc-') === 0) {
            globals[key] = 'fc';
        }
    }
    return globals;
};
