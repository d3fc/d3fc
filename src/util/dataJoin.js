(function(d3, fc) {
    'use strict';

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

    fc.util.dataJoin = function() {
        var selector = 'g',
            children = false,
            element = 'g',
            attrs = {},
            key = fc.util.fn.index;

        var dataJoin = function(container, data) {

            var joinedData = data || fc.util.fn.identity;

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
            var enterSelection = updateSelection.enter()
                .append(element) // <<<--- this is the secret sauce of this whole file
                .attr(attrs)
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
        dataJoin.attrs = function(x) {
            if (!arguments.length) {
                return attrs;
            }

            if (arguments.length === 1) {
                attrs = arguments[0];
            } else if (arguments.length === 2) {
                var key = arguments[0];
                var value = arguments[1];

                attrs[key] = value;
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
    };
}(d3, fc));
