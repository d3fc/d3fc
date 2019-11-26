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
    let explicitTransition = null;

    const dataJoin = function(container, data) {
        data = data || ((d) => d);

        const implicitTransition = container.selection ? container : null;
        if (implicitTransition) {
            container = container.selection();
        }

        const selected = container.selectAll((d, i, nodes) =>
              Array.from(nodes[i].childNodes)
                  .filter(node => node.nodeType === 1)
            )
            .filter(className == null ? element : `${element}.${className}`);
        let update = selected.data(data, key);

        const enter = update.enter()
            .append(element)
            .attr('class', className);

        let exit = update.exit();

        // automatically merge in the enter selection
        update = update.merge(enter);

        // if transitions are enabled apply a default fade in/out transition
        const transition = implicitTransition || explicitTransition;
        if (transition) {
            update = update.transition(transition)
                .style('opacity', 1);
            enter.style('opacity', effectivelyZero);
            exit = exit.transition(transition)
                .style('opacity', effectivelyZero);
        }

        exit.remove();

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
            return explicitTransition;
        }
        explicitTransition = args[0];
        return dataJoin;
    };

    return dataJoin;
};
