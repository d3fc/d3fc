import d3 from 'd3';

/**
 * An overload of the d3.rebind method which allows the source methods
 * to be rebound to the target with a different name. In the mappings object
 * keys represent the target method names and values represent the source
 * object names.
 */
export function rebind(target, source, mappings) {
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
}

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

/**
 * Rebinds all the methods from the source component, adding the given prefix. An
 * optional exclusions parameter can be used to specify methods which should not
 * be rebound.
 */
export function rebindAll(target, source, prefix, exclusions) {
    prefix = typeof prefix !== 'undefined' ? prefix : '';

    // if exclusions isn't an array, construct it
    if (!(arguments.length === 4 && Array.isArray(exclusions))) {
        exclusions = Array.prototype.slice.call(arguments, 3);
    }

    exclusions = exclusions.map(function(exclusion) {
        if (typeof(exclusion) === 'string') {
            if (!source.hasOwnProperty(exclusion)) {
                throw new Error('The method ' + exclusion + ' does not exist on the source object');
            }
            exclusion = new RegExp('^' + exclusion + '$');
        }
        return exclusion;
    });

    function exclude(testedProperty) {
        return exclusions.some(function(exclusion) {
            return testedProperty.match(exclusion);
        });
    }

    function reboundPropertyName(inputProperty) {
        return prefix !== '' ? prefix + capitalizeFirstLetter(inputProperty) : inputProperty;
    }

    var bindings = {};
    for (var property in source) {
        if (source.hasOwnProperty(property) && !exclude(property)) {
            bindings[reboundPropertyName(property)] = property;
        }
    }

    rebind(target, source, bindings);
}
