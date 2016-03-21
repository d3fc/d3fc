import d3 from 'd3';

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

export default function() {
    var selector = 'g';
    var children = false;
    var element = 'g';
    var attr = {};
    var key = (_, i) => i;

    var dataJoin = function(container, data) {

        var joinedData = data || ((d) => d);

        // Can't use instanceof d3.selection (see #458)
        if (!(container.selectAll && container.node)) {
            container = d3.select(container);
        }

        // update
        var selection = container.selectAll(selector);
        if (children) {
            // in order to support nested selections, they can be filtered
            // to only return immediate children of the container
            selection = selection.filter(function() {
                return this.parentNode === container.node();
            });
        }
        var updateSelection = selection.data(joinedData, key);

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
            .attr(attr)
            .style('opacity', effectivelyZero);

        // exit
        // when container is a transition, exiting elements fade out (from opaque to transparent)
        var exitSelection = d3.transition(updateSelection.exit())
            .style('opacity', effectivelyZero)
            .remove();

        // when container is a transition, all properties of the transition (which can be interpolated)
        // will transition
        updateSelection = d3.transition(updateSelection)
            .style('opacity', 1);

        updateSelection.enter = d3.functor(enterSelection);
        updateSelection.exit = d3.functor(exitSelection);
        return updateSelection;
    };

    dataJoin.selector = function(x) {
        if (!arguments.length) {
            return selector;
        }
        selector = x;
        return dataJoin;
    };
    dataJoin.children = function(x) {
        if (!arguments.length) {
            return children;
        }
        children = x;
        return dataJoin;
    };
    dataJoin.element = function(x) {
        if (!arguments.length) {
            return element;
        }
        element = x;
        return dataJoin;
    };
    dataJoin.attr = function(x) {
        if (!arguments.length) {
            return attr;
        }

        if (arguments.length === 1) {
            attr = arguments[0];
        } else if (arguments.length === 2) {
            var dataKey = arguments[0];
            var value = arguments[1];

            attr[dataKey] = value;
        }

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
