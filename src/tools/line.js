(function(d3, fc) {
    'use strict';

    fc.tools.line = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            value = fc.utilities.fn.identity,
            keyValue = fc.utilities.fn.index,
            label = value,
            decorate = fc.utilities.fn.noop,
            orient = 'horizontal';

        var dataJoin = fc.utilities.dataJoin()
            .selector('g.annotation')
            .element('g')
            .attrs({'class': 'annotation'});

        var line = function(selection) {
            selection.each(function(data) {

                // the value scale which the annotation 'value' relates to, the crossScale
                // is the other. Which is which depends on the orienation!
                var valueScale, crossScale, translation, lineProperty,
                    handleOne, handleTwo,
                    textAttributes = {x: -5, y: -5};
                switch (orient) {
                    case 'horizontal':
                        translation = function(a, b) { return 'translate(' + a + ', ' + b + ')'; };
                        lineProperty = 'x2';
                        crossScale = xScale;
                        valueScale = yScale;
                        handleOne = 'left-handle';
                        handleTwo = 'right-handle';
                        break;

                    case 'vertical':
                        translation = function(a, b) { return 'translate(' + b + ', ' + a + ')'; };
                        lineProperty = 'y2';
                        crossScale = yScale;
                        valueScale = xScale;
                        textAttributes.transform = 'rotate(-90)';
                        handleOne = 'bottom-handle';
                        handleTwo = 'top-handle';
                        break;

                    default:
                        throw new Error('Invalid orientation');
                }

                // ordinal axes have a rangeExtent function, this adds any padding that
                // was applied to the range. This functions returns the rangeExtent
                // if present, or range otherwise
                function range(scale) {
                    return scale.rangeExtent ? scale.rangeExtent() : scale.range();
                }

                var scaleRange = range(crossScale),
                    // the transform that sets the 'origin' of the annotation
                    containerTransform = function(d) {
                        var transform = valueScale(value(d));
                        return translation(scaleRange[0], transform);
                    },
                    scaleWidth = scaleRange[1] - scaleRange[0];

                var container = d3.select(this);

                // Create a group for each line
                data = Array.isArray(data) ? data : [data];
                var g = dataJoin(container, data);

                // create the outer container and line
                var enter = g.enter()
                    .attr('transform', containerTransform);
                enter.append('line')
                    .attr(lineProperty, scaleWidth);

                // create containers at each end of the annotation
                enter.append('g')
                    .classed(handleOne, true);

                enter.append('g')
                    .classed(handleTwo, true)
                    .attr('transform', translation(scaleWidth, 0))
                    .append('text')
                    .attr(textAttributes);

                // Update

                // translate the parent container to the left hand edge of the annotation
                g.attr('transform', containerTransform);

                // Update the text label
                g.select('text')
                    .text(label);

                decorate(g);
            });
        };

        line.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return line;
        };
        line.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return line;
        };
        line.value = function(x) {
            if (!arguments.length) {
                return value;
            }
            value = d3.functor(x);
            return line;
        };
        line.keyValue = function(x) {
            if (!arguments.length) {
                return keyValue;
            }
            keyValue = d3.functor(x);
            return line;
        };
        line.label = function(x) {
            if (!arguments.length) {
                return label;
            }
            label = d3.functor(x);
            return line;
        };
        line.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return line;
        };
        line.orient = function(x) {
            if (!arguments.length) {
                return orient;
            }
            orient = x;
            return line;
        };
        return line;
    };

}(d3, fc));
