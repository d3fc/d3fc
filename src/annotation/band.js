(function(d3, fc) {
    'use strict';

    fc.annotation.band = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            value0 = fc.util.fn.identity,
            value1 = fc.util.fn.identity,
            decorate = fc.util.fn.noop,
            orient = 'horizontal';

        var dataJoin = fc.util.dataJoin()
            .selector('g.annotation')
            .element('g')
            .attrs({'class': 'annotation'});

        function pickFirst(a, d) { return a; }
        function pickSecond(a, d) { return d; }

        var band = function(selection) {
            selection.each(function(data) {

                // the value scale which the annotation 'value' relates to, the crossScale
                // is the other. Which is which depends on the orientation!
                var valueScale, crossScale, translation, height, width;
                switch (orient) {
                    case 'horizontal':
                        translation = function(a, b) { return 'translate(' + a + ', ' + b + ')'; };
                        height = pickFirst;
                        width = pickSecond;
                        crossScale = xScale;
                        valueScale = yScale;
                        break;

                    case 'vertical':
                        translation = function(a, b) { return 'translate(' + b + ', ' + a + ')'; };
                        height = pickSecond;
                        width = pickFirst;
                        crossScale = yScale;
                        valueScale = xScale;
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
                        var transform = valueScale(value1(d));
                        return translation(scaleRange[0], transform);
                    },
                    valueWidth = function(d) {
                        var v0 = valueScale(value0(d));
                        var v1 = valueScale(value1(d));
                        return v0 - v1;
                    },
                    scaleWidth = scaleRange[1] - scaleRange[0];

                var container = d3.select(this);

                // Create a group for each band
                var g = dataJoin(container, data);

                // create the outer container and band path
                var enter = g.enter()
                    .attr('transform', containerTransform);
                enter.append('path')
                    .classed('band', true);

                var pathGenerator = fc.svg.bar()
                    .x(0)
                    .y(0)
                    .centred(false)
                    .height(height(valueWidth, scaleWidth))
                    .width(width(valueWidth, scaleWidth));

                g.select('path')
                    .attr('d', function(d) { return pathGenerator([d]); });

                decorate(g);
            });
        };

        band.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return band;
        };
        band.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return band;
        };
        band.value1 = function(x) {
            if (!arguments.length) {
                return value1;
            }
            value1 = x;
            return band;
        };
        band.value0 = function(x) {
            if (!arguments.length) {
                return value0;
            }
            value0 = d3.functor(x);
            return band;
        };
        band.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return band;
        };
        band.orient = function(x) {
            if (!arguments.length) {
                return orient;
            }
            orient = x;
            return band;
        };
        return band;
    };

}(d3, fc));
