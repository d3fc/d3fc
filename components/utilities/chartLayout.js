(function(d3, fc) {
    'use strict';

    /**
    * Based on the [Margin Convention]{@link http://bl.ocks.org/mbostock/3019563},
    * the Chart Layout component is responsible for defining the chart area.
    *
    * It attempts to simplify the repetitive process of constructing the chart's layout and its associated elements:
    * <ul>
    *   <li>Define the margins, height and width</li>
    *   <li>Calculate the inner height and inner width</li>
    *   <li>Create an SVG</li>
    *   <li>Create a group for all chart elements; translate it based on the margins</li>
    *   <li>Create a clipping path for the plot area; add it to the group</li>
    *   <li>Create groups for the axes</li>
    * </ul>
    *
    * If the width or height of the component have not been explicitly set using chartLayout.height()
    * or chartLayout.width(), then the width and height of the chartLayout will try to expand to the
    * dimensions of the selected element. If this results in an invalid value, i.e. less than 1,
    * a default value will be used.
    *
    * <hr>
    *
    * Given a div:
    * <pre>
    * &lt;div id=&quot;myChart&quot; style=&quot;width:650px; height:300px;&quot;&gt;&lt;/div&gt;
    * </pre>
    *
    * Chart Layout will tranform the selection to create the following elements:
    * <pre>
    * &lt;div id=&quot;myChart&quot; style=&quot;width:650px; height:300px;&quot;&gt;
    *     &lt;svg width=&quot;650&quot; height=&quot;300&quot;&gt;
    *         &lt;g class=&quot;chartArea&quot; transform=&quot;translate(40,20)&quot;&gt;
    *             &lt;defs&gt;
    *                 &lt;clipPath id=&quot;fcPlotAreaClip_myChart&quot;&gt;
    *                     &lt;rect width=&quot;570&quot; height=&quot;260&quot;&gt;&lt;/rect&gt;
    *                 &lt;/clipPath&gt;
    *             &lt;/defs&gt;
    *             &lt;rect class=&quot;background&quot; width=&quot;570&quot; height=&quot;260&quot;&gt;&lt;/rect&gt;
    *             &lt;g clip-path=&quot;url(#fcPlotAreaClip_myChart)&quot; class=&quot;plotArea&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis bottom&quot; transform=&quot;translate(0,260)&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis top&quot; transform=&quot;translate(0, 0)&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis right&quot; transform=&quot;translate(570, 0)&quot;&gt;&lt;/g&gt;
    *         &lt;/g&gt;
    *     &lt;/svg&gt;
    * &lt;/div&gt;
    * </pre>
    *
    * @type {object}
    * @memberof fc.utilities
    * @namespace fc.utilities.chartLayout
    */
    fc.utilities.chartLayout = function() {

        // Default values
        var margin = {top: 20, right: 40, bottom: 20, left: 40},
            width = 0,
            height = 0;

        var defaultWidth = true,
            defaultHeight = true;

        // The elements created for the chart
        var chartElements = {};

        /**
         * Constructs a new instance of the chartLayout component.
         *
         * Applies the chartLayout to a [D3 selection]{@link https://github.com/mbostock/d3/wiki/Selections}
         * (commonly  a <code>div</code>).
         * The chartLayout component can only be applied to the first element in a selection,
         * all other elements will be ignored.
         *
         * @example
         * // Setup the chart layout
         * var layout = fc.utilities.chartLayout();
         *
         * // Setup the chart
         * var setupArea = d3.select('#chart')
         *     .call(layout);
         *
         * @memberof fc.utilities.chartLayout#
         * @method chartLayout
         * @param {selection} selection a D3 selection
         */
        var chartLayout = function(selection) {
            // Select the first element in the selection
            // If the selection contains more than 1 element,
            // only the first will be used, the others will be ignored
            var element = selection.node(),
                style = getComputedStyle(element);

            // Attempt to automatically size the chart to the selected element
            if (defaultWidth === true) {
                // Set the width of the chart to the width of the selected element,
                // excluding any margins, padding or borders
                var paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
                width = element.clientWidth - paddingWidth;

                // If the new width is too small, use a default width
                if (chartLayout.getPlotAreaWidth() < 1) {
                    width = 600 + margin.left + margin.right;
                }
            }

            if (defaultHeight === true) {
                // Set the height of the chart to the height of the selected element,
                // excluding any margins, padding or borders
                var paddingHeight = parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
                height = element.clientHeight - paddingHeight;

                // If the new height is too small, use a default height
                if (chartLayout.getPlotAreaHeight() < 1) {
                    height = 400 + margin.top + margin.bottom;
                }
            }

            // Setup the elements - following the general update pattern (http://bl.ocks.org/mbostock/3808218)
            //
            // When creating the elements for the chart, only one of each element is required. To achieve this we bind
            // a single datum to each selection - this is represented in the dummyData variable. This data-join is only
            // used for creating and updating the elements - through data(), enter() and exit(); the value of the data
            // is irrelevant (but there must only be one value). This approach is similar to that used in D3's axis
            // and brush components.
            //
            // For each element, we:
            // 1. Select the element(s) and bind a single datum to that selection
            // 2. If no element currently exists, append it (this is in the enter() subselection)
            // 3. Update the element as required
            // 4. If there are too many of the selected element(>1), then remove it (this is in the exit() subselection)
            var container = d3.select(element),
                dummyData = [0];

            // Create svg
            chartElements.svg = container.selectAll('svg').data(dummyData);
            chartElements.svg.enter().append('svg');
            chartElements.svg.attr('width', width)
                .attr('height', height)
                .style('display', 'block');
            chartElements.svg.exit().remove();

            // Create group for the chart
            var chart = chartElements.svg.selectAll('g.chartArea').data(dummyData);
            chart.enter().append('g');
            chart.attr('class', 'chartArea')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            chart.exit().remove();
            chartElements.chartArea = chart;

            // Defs - for clipping path
            var defs = chart.selectAll('defs').data(dummyData);
            defs.enter().append('defs');
            defs.exit().remove();

            // Get an ID for the clipping path
            // If the element already has an ID, use that;
            // otherwise, generate one (to avoid duplicate IDs)
            var plotAreaClipId = 'fcPlotAreaClip_' + (element.id || nextId());

            // Clipping path
            var clippingPath = defs.selectAll('clippath').data(dummyData);
            clippingPath.enter().append('clippath');
            clippingPath.attr('id', plotAreaClipId);
            clippingPath.exit().remove();

            // Clipping path rect
            var clippingPathRect = clippingPath.selectAll('rect').data(dummyData);
            clippingPathRect.enter().append('rect');
            clippingPathRect.attr('width', chartLayout.getPlotAreaWidth())
                .attr('height', chartLayout.getPlotAreaHeight());
            clippingPathRect.exit().remove();

            // Create a background element
            chartElements.plotAreaBackground = chart.selectAll('rect.background').data(dummyData);
            chartElements.plotAreaBackground.enter().append('rect');
            chartElements.plotAreaBackground.attr('class', 'background')
                .attr('width', chartLayout.getPlotAreaWidth())
                .attr('height', chartLayout.getPlotAreaHeight());
            chartElements.plotAreaBackground.exit().remove();

            // Create plot area, using the clipping path
            chartElements.plotArea = chart.selectAll('g.plotArea').data(dummyData);
            chartElements.plotArea.enter().append('g');
            chartElements.plotArea.attr('clip-path', 'url(#' + plotAreaClipId + ')')
                .attr('class', 'plotArea');
            chartElements.plotArea.exit().remove();

            // Create containers for the axes
            chartElements.axisContainer = {};

            chartElements.axisContainer.bottom = chart.selectAll('g.axis.bottom').data(dummyData);
            chartElements.axisContainer.bottom.enter().append('g');
            chartElements.axisContainer.bottom.attr('class', 'axis bottom')
                .attr('transform', 'translate(0, ' + chartLayout.getPlotAreaHeight() + ')');
            chartElements.axisContainer.bottom.exit().remove();


            chartElements.axisContainer.top = chart.selectAll('g.axis.top').data(dummyData);
            chartElements.axisContainer.top.enter().append('g');
            chartElements.axisContainer.top.attr('class', 'axis top')
                .attr('transform', 'translate(0, 0)');
            chartElements.axisContainer.top.exit().remove();


            chartElements.axisContainer.left = chart.selectAll('g.axis.left').data(dummyData);
            chartElements.axisContainer.left.enter().append('g');
            chartElements.axisContainer.left.attr('class', 'axis left')
                .attr('transform', 'translate(0, 0)');
            chartElements.axisContainer.left.exit().remove();


            chartElements.axisContainer.right = chart.selectAll('g.axis.right').data(dummyData);
            chartElements.axisContainer.right.enter().append('g');
            chartElements.axisContainer.right.attr('class', 'axis right')
                .attr('transform', 'translate(' + chartLayout.getPlotAreaWidth() + ', 0)');
            chartElements.axisContainer.right.exit().remove();
        };

        /**
         * Get/set the size of the top margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginTop
         * @param  {number} [value] The size of the top margin
         * @returns {number|chartLayout} If value is specified, sets the top margin and returns the chartLayout;
         * if value is not specified, returns the top margin.
         */
        chartLayout.marginTop = function(value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return chartLayout;
        };

        /**
         * Get/set the size of the right margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginRight
         * @param  {number} [value] The size of the right margin
         * @returns {number|chartLayout} If value is specified, sets the right margin and returns the chartLayout;
         * if value is not specified, returns the right margin.
         */
        chartLayout.marginRight = function(value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return chartLayout;
        };

        /**
         * Get/set the size of the bottom margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginBottom
         * @param  {number} [value] The size of the bottom margin
         * @returns {number|chartLayout} If value is specified, sets the bottom margin and returns the chartLayout;
         * if value is not specified, returns the bottom margin.
         */
        chartLayout.marginBottom = function(value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return chartLayout;
        };

        /**
         * Get/set the size of the left margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginLeft
         * @param  {number} [value] The size of the left margin
         * @returns {number|chartLayout} If value is specified, sets the left margin and returns the chartLayout;
         * if value is not specified, returns the left margin.
         */
        chartLayout.marginLeft = function(value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return chartLayout;
        };

        /**
         * Get/set the width of the chart.
         *
         * If the width of the chart is not explicitly set before calling chartLayout on a selection,
         * the component will attempt to size the chart to the dimensions of the selection's first element.
         *
         * @memberof fc.utilities.chartLayout#
         * @method width
         * @param  {number} [value] The width of the chart
         * @returns {number|chartLayout} If value is specified, sets the width and returns the chartLayout;
         * if value is not specified, returns the width.
         */
        chartLayout.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return chartLayout;
        };

        /**
         * Get/set the height of the chart.
         *
         * If the height of the chart is not explicitly set before calling chartLayout on a selection,
         * the component will attempt to size the chart to the dimensions of the selection's first element.
         *
         * @memberof fc.utilities.chartLayout#
         * @method height
         * @param  {number} [value] The height of the chart
         * @returns {number|chartLayout} If value is specified, sets the height and returns the chartLayout;
         * if value is not specified, returns the height.
         */
        chartLayout.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return chartLayout;
        };

        /**
         * Get the width of the plot area. This is the total width of the chart minus the horizontal margins.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaWidth
         * @returns {number} The width of the plot area.
         */
        chartLayout.getPlotAreaWidth = function() {
            return width - margin.left - margin.right;
        };

        /**
         * Get the height of the plot area. This is the total height of the chart minus the vertical margins.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaHeight
         * @returns {number} The height of the plot area.
         */
        chartLayout.getPlotAreaHeight = function() {
            return height - margin.top - margin.bottom;
        };

        /**
         * Get the SVG for the chart.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getSVG
         * @returns {selection} The SVG for the chart.
         */
        chartLayout.getSVG = function() {
            return chartElements.svg;
        };

        /**
         * Get the chart area group for the chart.
         * Typically axes will be added to the chart area.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getChartArea
         * @returns {selection} The chart's plot area.
         */
        chartLayout.getChartArea = function() {
            return chartElements.chartArea;
        };

        /**
         * Get the plot area group for the chart.
         * The plot area has a clipping path, so this is typically where series and indicators will be added.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotArea
         * @returns {selection} The chart's plot area.
         */
        chartLayout.getPlotArea = function() {
            return chartElements.plotArea;
        };

        /**
         * Get the group container for an axis.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getAxisContainer
         * @param  {string} orientation The orientation of the axis container;
         * valid values are 'top', 'bottom', 'left' or 'right'
         * @returns {selection} The group for the specified axis orientation.
         */
        chartLayout.getAxisContainer = function(orientation) {
            return chartElements.axisContainer[orientation];
        };

        /**
         * Get the plot area's background element.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaBackground
         * @returns {selection} The background rect of the plot area.
         */
        chartLayout.getPlotAreaBackground = function() {
            return chartElements.plotAreaBackground;
        };

        return chartLayout;
    };

    // Generates an integer ID
    var nextId = (function() {
        var id = 0;
        return function() {
            return ++id;
        };
    })();

}(d3, fc));