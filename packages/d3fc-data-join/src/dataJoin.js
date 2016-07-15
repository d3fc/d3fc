import { select, selection } from 'd3-selection';

// "Caution: avoid interpolating to or from the number zero when the interpolator is used to generate
// a string (such as with attr).
// Very small values, when stringified, may be converted to scientific notation and
// cause a temporarily invalid attribute or style property value.
// For example, the number 0.0000001 is converted to the string "1e-7".
// This is particularly noticeable when interpolating opacity values.
// To avoid scientific notation, start or end the transition at 1e-6,
// which is the smallest value that is not stringified in exponential notation."
// - https://github.com/mbostock/d3/wiki/Transitions#d3_interpolateNumber
var effectivelyZero = 1e-6;

// Wrapper around d3's selectAll/data data-join, which allows decoration of the result.
// This is achieved by appending the element to the enter selection before exposing it.
// A default transition of fade in/out is also implicitly added but can be modified.

export default function(element, className) {
    element = element || 'g';

    var key = (_, i) => i;

    var dataJoin = function(container, data) {
        data = data || ((d) => d);

        // update
        var selector = className == null ? element : element + '.' + className;
        var selected = container.selectAll(selector)
            // in order to support nested selections, they can be filtered
            // to only return immediate children of the container
            .filter(function() {
                return this.parentNode === container.node();
            });
        var updateSelection = selected.data(data, key);

        // enter
        // when container is a transition, entering elements fade in (from transparent to opaque)
        // N.B. insert() is used to create new elements, rather than append(). insert() behaves in a special manner
        // on enter selections - entering elements will be inserted immediately before the next following sibling
        // in the update selection, if any.
        // This helps order the elements in an order consistent with the data, but doesn't guarantee the ordering;
        // if the updating elements change order then selection.order() would be required to update the order.
        // (#528)
        var enterSelection = updateSelection.enter()
            .insert(element) // <<<--- this is the secret sauce of this whole file
            .attr('class', className);

        // exit
        // when container is a transition, exiting elements fade out (from opaque to transparent)
        var exitSelection = updateSelection.exit();

        // automatically merge in the enter selection
        updateSelection = updateSelection.merge(enterSelection);

        // if transitions are enable inherit the default transition from ancestors
        // and apply a default fade in/out transition
        if (selection.prototype.transition) {
            enterSelection.style('opacity', effectivelyZero);
            updateSelection.transition()
                .style('opacity', 1);
            exitSelection.transition()
                .style('opacity', effectivelyZero);
        }

        // automatically remove nodes in the exit selection
        exitSelection.remove();

        updateSelection.enter = function() { return enterSelection; };
        updateSelection.exit = function() { return exitSelection; };

        return updateSelection;
    };

    dataJoin.element = function(x) {
        if (!arguments.length) {
            return element;
        }
        element = x;
        return dataJoin;
    };
    dataJoin.className = function(x) {
        if (!arguments.length) {
            return className;
        }
        className = x;
        return dataJoin;
    };
    dataJoin.key = function(x) {
        if (!arguments.length) {
            return key;
        }
        key = x;
        return dataJoin;
    };

    return dataJoin;
}
