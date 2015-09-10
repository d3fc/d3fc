(function(d3, fc) {
    'use strict';
    /**
     * An overload of the d3.rebind method which allows the source methods
     * to be rebound to the target with a different name. In the mappings object
     * keys represent the target method names and values represent the source
     * object names.
     */
    fc.util.rebind = function(target, source, mappings) {
        if (typeof(mappings) !== 'object') {
            return d3.rebind.apply(d3, arguments);
        }
        Object.keys(mappings)
            .forEach(function(targetName) {
                var method = source[mappings[targetName]];
                if (typeof method !== 'function') {
                    throw new Error('The method ' + mappings[targetName] + ' does not exist on the source object');
                }
                target[targetName] = function() {
                    var value = method.apply(source, arguments);
                    return value === source ? target : value;
                };
            });
        return target;
    };

    function capitalizeFirstLetter(str) {
        return str[0].toUpperCase() + str.slice(1);
    }

    /**
     * Rebinds all the methods from the source component, adding the given prefix. An
     * optional exclusions parameter can be used to specify methods which should not
     * be rebound.
     */
    fc.util.rebindAll = function(target, source, prefix, exclusions) {
        if (arguments.length === 3) {
            // if only three args are supplied, there are no exclusions
            exclusions = [];
        } else if (arguments.length === 4) {
            // if four args are supplied, check exclusions is an array, if not
            // assume it is a single string and construct an array
            if (!Array.isArray(exclusions)) {
                exclusions = [exclusions];
            }
        } else {
            // for > 4 args, construct the exclusions
            var args = Array.prototype.slice.call(arguments);
            exclusions = args.slice(3);
        }

        exclusions.forEach(function(property) {
            if (!source.hasOwnProperty(property)) {
                throw new Error('The method ' + property + ' does not exist on the source object');
            }
        });

        var bindings = {};
        for (var property in source) {
            if (source.hasOwnProperty(property) && exclusions.indexOf(property) === -1) {
                bindings[prefix + capitalizeFirstLetter(property)] = property;
            }
        }
        fc.util.rebind(target, source, bindings);
    };
}(d3, fc));
