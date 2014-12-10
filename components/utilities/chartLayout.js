(function (d3, fc) {
    'use strict';

    fc.utilities.chartLayout = function () {

        // Default values
        var margin = {top: 20, right: 40, bottom: 20, left: 40},
            width = 0,
            height = 0;

        var defaultWidth = true,
            defaultHeight = true;

        var chartLayout = function (selection) {
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
                if (chartLayout.innerWidth() < 1) {
                    width = 800 + margin.left + margin.right;
                }
            }

            if (defaultHeight === true) {
                // Set the height of the chart to the height of the selected element,
                // excluding any margins, padding or borders
                var paddingHeight = parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
                height = element.clientHeight - paddingHeight;

                // If the new height is too small, use a default height
                if (chartLayout.innerHeight() < 1) {
                    height = 400 + margin.top + margin.bottom;
                }
            }

            // Create svg
            var svg = d3.select(element).append('svg')
                .attr('width', width)
                .attr('height', height);

            // Create group for the chart
            var chart = svg.append('g')
                .attr('class', 'chartArea')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // Clipping path
            chart.append('defs').append('clipPath')
                .attr('id', 'plotAreaClip')
                .append('rect')
                .attr({width: chartLayout.innerWidth(), height: chartLayout.innerHeight()});

            // Create a background element
            chart.append('rect')
                .attr('class', 'background')
                .attr('width', chartLayout.innerWidth())
                .attr('height', chartLayout.innerHeight());

            // Create plot area, using the clipping path
            chart.append('g')
                .attr('clip-path', 'url(#plotAreaClip)')
                .attr('class', 'plotArea');

            // Create containers for the axes
            chart.append('g')
                .attr('class', 'axis bottom')
                .attr('transform', 'translate(0,' + chartLayout.innerHeight() + ')');
            chart.append('g')
                .attr('class', 'axis top')
                .attr('transform', 'translate(0, 0)');
            chart.append('g')
                .attr('class', 'axis left')
                .attr('transform', 'translate(0, 0)');
            chart.append('g')
                .attr('class', 'axis right')
                .attr('transform', 'translate(' + chartLayout.innerWidth() + ', 0)');

        };

        chartLayout.marginTop = function (value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return chartLayout;
        };

        chartLayout.marginRight = function (value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return chartLayout;
        };

        chartLayout.marginBottom = function (value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return chartLayout;
        };

        chartLayout.marginLeft = function (value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return chartLayout;
        };

        chartLayout.width = function (value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return chartLayout;
        };

        chartLayout.height = function (value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return chartLayout;
        };

        chartLayout.innerWidth = function () {
            return width - margin.left - margin.right;
        };

        chartLayout.innerHeight = function () {
            return height - margin.top - margin.bottom;
        };

        chartLayout.getSVG = function (setupArea) {
            return setupArea.select('svg');
        };

        chartLayout.getChartArea = function (setupArea) {
            return chartLayout.getSVG(setupArea).select('.chartArea');
        };

        chartLayout.getPlotArea = function (setupArea) {
            return chartLayout.getSVG(setupArea).select('.plotArea');
        };

        chartLayout.getAxisContainer = function (setupArea, orientation) {
            return chartLayout.getSVG(setupArea).select('.axis.' + orientation);
        };

        chartLayout.getPlotAreaBackground = function (setupArea) {
            return chartLayout.getSVG(setupArea).select('.chartArea rect.background');
        };

        return chartLayout;
    };
}(d3, fc));