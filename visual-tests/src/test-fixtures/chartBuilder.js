(function(d3, fc) {
    'use strict';

    if (!fc.test) {
        fc.test = {};
    }

    /**
    * The chart builder makes it easier to constructs charts from a number of D3FC or D3 components. It
    * adapts a chartLayout (which is responsible for creating a suitable SVG structure for a chart), and allows
    * you to associate components (axes, series, etc ...) with the chart. The chart builder
    * is responsible for associating data with the components, setting the ranges of the scales and updating
    * the components when the chart needs to be re-drawn.
    *
    * @type {object}
    * @memberof fc.utilities
    * @class fc.utilities.chartBuilder
    */
    fc.test.chartBuilder = function(chartLayout) {

        // the components that have been added to the chart.
        var plotAreaComponents = [];
        var axes = {};

        // the selection that this chart is associated with
        var callingSelection;

        var chartBuilder = function(selection) {
            callingSelection = selection;
            selection.call(chartLayout);
        };

        /**
         * Adds a number of components to the chart plot area. The chart layout is responsible for
         * rendering these components via the render function.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method addToPlotArea
         * @param  {array} components an array of components to add to the plot area
         */
        chartBuilder.addToPlotArea = function(components) {
            components.forEach(function(component) {
                plotAreaComponents.push({
                    component: component,
                    selection: null
                });
            });
        };

        /**
         * Provides the data that will be joined with the plot area selection, and as a result
         * is the data used by components that are associated with the ploa area.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method setData
         * @param  {array} data the data to associate with the plot area
         */
        chartBuilder.setData = function(data) {
            chartLayout.getPlotArea().datum(data);
        };

        /**
         * Sets the chart axis with the given orientation. The chart builder is responsible for setting
         * the range of this axis and rendering it via the render function.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method setAxis
         * @param  {string} orientation The orientation of the axis container
         * @param  {object} axis a D3 or D3FC axis component
         */
        chartBuilder.setAxis = function(orientation, axis) {
            axes[orientation] = axis;
        };

        /**
         * Renders all of the components associated with this chart. During the render process
         * the axes have their scales set to an appropriate value.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method render
         */
        chartBuilder.render = function() {
            callingSelection.call(chartLayout);

            // call each of the axis components with the axis selection
            for (var axisOrientation in axes) {
                if (axes.hasOwnProperty(axisOrientation)) {
                    var axisContainer = chartLayout.getAxisContainer(axisOrientation);
                    var axis = axes[axisOrientation];
                    if (axisOrientation === 'top' || axisOrientation === 'bottom') {
                        axis.scale().range([0, chartLayout.getPlotAreaWidth()]);
                    } else {
                        axis.scale().range([chartLayout.getPlotAreaHeight(), 0]);
                    }
                    axisContainer.call(axis);
                }
            }

            // call each of the plot area components
            plotAreaComponents.forEach(function(component) {
                if (component.selection == null) {
                    component.selection = chartLayout.getPlotArea()
                        .append('g');
                }
                component.selection.call(component.component);
            });
        };

        return chartBuilder;
    };
}(d3, fc));