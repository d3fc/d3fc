(function (d3, fc) {
    'use strict';

    fc.utilities.chartZoom = function () {

        var xScale = d3.time.scale();
        var yScale = d3.scale.linear();

        var zoomBehavior = d3.behavior.zoom();
        var components = [];

        var chartZoom = function (selection) {
            selection.each(function () {
                zoomBehavior.x(xScale);
                selection.call(zoomBehavior);
            });
        };

        var zoomed = function () {
            var component, selection;
            // Todo: Auto yScale domain update, error handling...

            components.forEach(function (pair) {
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

        chartZoom.getZoomBehavior = function () {
            return zoomBehavior;
        };

        chartZoom.components = function (value) {
            if (!arguments.length) {
                return components;
            } else {
                components = value;
            }
            return chartZoom;
        };

        chartZoom.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return chartZoom;
        };

        chartZoom.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return chartZoom;
        };

        zoomBehavior.on("zoom", zoomed);
        return chartZoom;
    };

}(d3, fc));