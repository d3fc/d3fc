(function (d3, sl) {
    'use strict';

    sl.utilities.dimensions = function () {

        // Default values
        var margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 0,
            height = 0;

        var defaultWidth = true,
            defaultHeight = true;

        var dimensions = function (selection) {
            selection.each( function () {
                var element = d3.select(this),
                    style = getComputedStyle(this);

                // Attempt to automatically size the chart to the selected element
                if (defaultWidth === true) {
                    var paddingWidth = parseInt(style.paddingLeft) + parseInt(style.paddingRight),
                        borderWidth = parseInt(style.borderLeft) + parseInt(style.borderRight);

                    // Set the width of the chart to the width of the selected selected element,
                    // excluding any margins, padding or borders
                    width = this.offsetWidth - paddingWidth - borderWidth;

                    // If the new width is too small, use a default width
                    if (dimensions.innerWidth() < 1) {
                        width = 800 + margin.left + margin.right;
                    }
                }

                if (defaultHeight === true) {
                    var paddingHeight = parseInt(style.paddingTop) + parseInt(style.paddingBottom),
                        borderHeight = parseInt(style.borderTop) + parseInt(style.borderBottom);

                    // Set the height of the chart to the height of the selected selected element,
                    // excluding any margins, padding or borders
                    height = this.offsetHeight - paddingHeight - borderHeight;

                    // If the new height is too small, use a default height
                    if (dimensions.innerHeight() < 1) {
                        height = 400 + margin.top + margin.bottom;
                    }
                }

                // Create svg
                var svg = element.append('svg')
                    .attr('width', width)
                    .attr('height', height);

                // Create group for the chart
                var chart =  svg.append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // Clipping path
                chart.append('defs').append('clipPath')
                    .attr('id', 'plotAreaClip')
                    .append('rect')
                    .attr({ width: dimensions.innerWidth(), height: dimensions.innerHeight() });

                // Create plot area, using the clipping path
                chart.append('g')
                    .attr('clip-path', 'url(#plotAreaClip)')
                    .attr('class', 'plotArea');
            });
        };

        dimensions.marginTop = function (value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return dimensions;
        };

        dimensions.marginRight = function (value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return dimensions;
        };

        dimensions.marginBottom = function (value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return dimensions;
        };

        dimensions.marginLeft = function (value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return dimensions;
        };

        dimensions.width = function (value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return dimensions;
        };

        dimensions.height = function (value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return dimensions;
        };

        dimensions.innerWidth = function () {
            var innerWidth = width - margin.left - margin.right;
            return innerWidth;
        };

        dimensions.innerHeight = function () {
            var innerHeight = height - margin.top - margin.bottom;
            return innerHeight;
        };

        return dimensions;
    };
}(d3, sl));