(function(d3, fc) {
    'use strict';

    fc.utilities.simpleDataJoin = function(parent, className, data) {
        var updateSelection = parent.selectAll('g.' + className)
            .data(data);

        var enterSelection = updateSelection.enter()
            .append('g')
            .classed(className, true);

        updateSelection.exit()
            .remove();

        updateSelection.enter = d3.functor(enterSelection);

        return updateSelection;
    };
}(d3, fc));