(function(d3, fc) {
    'use strict';

    fc.utilities.series = {
        yScaleTransform: function(oldScale, newScale) {
            // Compute transform for elements wrt changing yScale.
            var oldDomain = oldScale.domain(),
                newDomain = newScale.domain(),
                scale = (oldDomain[1] - oldDomain[0]) / (newDomain[1] - newDomain[0]),
                translate = scale * (oldScale.range()[1] - oldScale(newDomain[1]));
            return {
                translate: translate,
                scale: scale
            };
        },

        zoom: function(elementClass) {
            return function(selection) {
                selection.each(function() {
                    var seriesElement = d3.select(this).selectAll(elementClass),
                        initialYScale = this.__chart__.initialYScale,
                        chartYScale = this.__chart__.yScale,
                        yDomain = chartYScale.domain(),
                        hidden = yDomain[0] === yDomain[1] || (isNaN(yDomain[0]) && isNaN(yDomain[1])),
                        yTransform = fc.utilities.series.yScaleTransform(initialYScale, chartYScale),
                        xTransform = {
                            scale: d3.event.scale,
                            translate: d3.event.translate[0]
                        };
                    seriesElement
                        .attr('visibility', function() {return (!hidden) ? 'visible' : 'hidden';})
                        .attr('transform', function() {
                            if (!hidden) {
                                return 'translate(' + xTransform.translate + ',' + yTransform.translate + ')' +
                                    ' scale(' + xTransform.scale + ',' + yTransform.scale + ')';
                            } else {
                                return null;
                            }
                        });
                });
            };
        }
    };
}(d3, fc));
