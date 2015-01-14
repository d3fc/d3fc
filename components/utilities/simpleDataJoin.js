(function(d3, fc) {
    'use strict';

    fc.utilities.simpleDataJoin = function(parent, className, data, dataKey) {
        var updateSelection = parent.selectAll('g.' + className)
            .data(data, dataKey || fc.utilities.fn.identity);

        var enterSelection = updateSelection.enter()
            .append('g')
            .classed(className, true);

        var exitSelection = d3.transition(updateSelection.exit())
            .remove();

        updateSelection = d3.transition(updateSelection);

        updateSelection.enter = d3.functor(enterSelection);
        updateSelection.exit = d3.functor(exitSelection);
        return updateSelection;
    };
}(d3, fc));