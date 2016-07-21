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
export const effectivelyZero = 1e-6;

// Wrapper around d3's selectAll/data data-join, which allows decoration of the result.
// This is achieved by appending the element to the enter selection before exposing it.
// A default transition of fade in/out is also implicitly added but can be modified.
export default (element, className) => {
    element = element || 'g';

    let key = (_, i) => i;
    let transition = null;

    const dataJoin = function(container, data) {
        data = data || ((d) => d);

        // update
        const selector = className == null ? element : `${element}.${className}`;
        const selected = container.selectAll(selector)
            // in order to support nested joins with the same selector, filter
            // to only return immediate children of the container
            .filter((d, i, nodes) => nodes[i].parentNode === container.node());
        let update = selected.data(data, key);

        // enter
        // when container is a transition, entering elements fade in (from transparent to opaque)
        // N.B. insert() is used to create new elements, rather than append(). insert() behaves in a special manner
        // on enter selections - entering elements will be inserted immediately before the next following sibling
        // in the update selection, if any.
        // This helps order the elements in an order consistent with the data, but doesn't guarantee the ordering;
        // if the updating elements change order then selection.order() would be required to update the order.
        // (#528)
        const enter = update.enter()
            .insert(element) // <<<--- this is the secret sauce of this whole file
            .attr('class', className);

        // exit
        // when container is a transition, exiting elements fade out (from opaque to transparent)
        const exit = update.exit();

        // automatically merge in the enter selection
        update = update.merge(enter);

        // if transitions are enabled apply a default fade in/out transition
        if (selection.prototype.transition) {
            enter.style('opacity', effectivelyZero)
                .transition(transition)
                .style('opacity', 1);
            exit.transition(transition)
                .style('opacity', effectivelyZero)
                .remove();
        } else {
            exit.remove();
        }

        update.enter = () => enter;
        update.exit = () => exit;

        return update;
    };

    dataJoin.element = (...args) => {
        if (!args.length) {
            return element;
        }
        element = args[0];
        return dataJoin;
    };
    dataJoin.className = (...args) => {
        if (!args.length) {
            return className;
        }
        className = args[0];
        return dataJoin;
    };
    dataJoin.key = (...args) => {
        if (!args.length) {
            return key;
        }
        key = args[0];
        return dataJoin;
    };
    dataJoin.transition = (...args) => {
        if (!args.length) {
            return transition;
        }
        transition = args[0];
        return dataJoin;
    };

    return dataJoin;
};
