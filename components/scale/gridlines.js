(function(d3, fc) {
    'use strict';

    fc.scale.gridlines = function() {

        var gridlines = function(selection) {

            selection.each(function() {

                var container = d3.select(this);

                var xLines = fc.utilities.simpleDataJoin(container, 'x',
                    gridlines.xScale.value.ticks(gridlines.xTicks.value));

                xLines.enter()
                    .append('line')
                    .attr('class', 'gridline');

                xLines.select('line')
                    .attr({
                        'x1': gridlines.xScale.value,
                        'x2': gridlines.xScale.value,
                        'y1': gridlines.yScale.value.range()[0],
                        'y2': gridlines.yScale.value.range()[1]
                    });

                var yLines = fc.utilities.simpleDataJoin(container, 'y',
                    gridlines.yScale.value.ticks(gridlines.yTicks.value));

                yLines.enter()
                    .append('line')
                    .attr('class', 'gridline');

                yLines.select('line')
                    .attr({
                        'x1': gridlines.xScale.value.range()[0],
                        'x2': gridlines.xScale.value.range()[1],
                        'y1': gridlines.yScale.value,
                        'y2': gridlines.yScale.value
                    });


            });
        };

        gridlines.xScale = fc.utilities.property(d3.time.scale());
        gridlines.yScale = fc.utilities.property(d3.scale.linear());
        gridlines.xTicks = fc.utilities.property(10);
        gridlines.yTicks = fc.utilities.property(10);


        return gridlines;
    };
}(d3, fc));
