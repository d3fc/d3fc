(function(d3, fc) {
    'use strict';

    fc.utilities.chartZoom = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var width = 100,
            height = 100;

        var zoomBehavior = d3.behavior.zoom();
        var components = [];

        var chartZoom = function(selection) {
            var zoomPane;

            zoomBehavior.x(xScale);
            selection.each(function() {
                zoomPane = d3.select(this).selectAll('.zoom-pane').data([0]);
                zoomPane.enter()
                    .append('rect')
                    .classed('zoom-pane', true);
                zoomPane
                    .attr({
                        width: width,
                        height: height,
                        fill: 'none'
                    })
                    .style('pointer-events', 'all');
                zoomPane.call(zoomBehavior);

            });
        };

        var zoomstart = function() {
        };

        var zoom = function() {
            var component, selection;
            // Todo: Auto yScale domain update, error handling,

            components.forEach(function(pair) {
                component = pair[0];
                selection = pair[1];
                if (component.zoom) {
                    // Component implements geometric zoom.
                    component.zoom(selection);
                } else {
                    // Semantic Zoom
                    selection.call(component);
                }
            });
        };

        var zoomend = function() {
            var component, selection;

            components.forEach(function(pair) {
                component = pair[0];
                selection = pair[1];
                if (component.zoomend) {
                    component.zoomend(selection);
                }
            });
        };

        chartZoom.getZoomBehavior = function() {
            return zoomBehavior;
        };

        chartZoom.components = function(value) {
            if (!arguments.length) {
                return components;
            } else {
                components = value;
            }
            return chartZoom;
        };

        chartZoom.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return chartZoom;
        };

        chartZoom.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return chartZoom;
        };

        chartZoom.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            return chartZoom;
        };

        chartZoom.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            return chartZoom;
        };

        zoomBehavior.on('zoomstart.chartZoomInternal', zoomstart);
        zoomBehavior.on('zoom.chartZoomInternal', zoom);
        zoomBehavior.on('zoomend.chartZoomInternal', zoomend);
        return chartZoom;
    };

}(d3, fc));