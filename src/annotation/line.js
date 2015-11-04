import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {identity, index, noop} from '../util/fn';
import {range} from '../util/scale';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        value = identity,
        keyValue = index,
        label = value,
        decorate = noop,
        orient = 'horizontal';

    var dataJoin = dataJoinUtil('annotation');

    var line = function(selection) {
        selection.each(function(data, index) {

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

            var scaleRange = range(crossScale),
                // the transform that sets the 'origin' of the annotation
                containerTransform = function(d) {
                    var transform = valueScale(value(d));
                    return translation(scaleRange[0], transform);
                },
                scaleWidth = scaleRange[1] - scaleRange[0];

            var container = d3.select(this);

            // Create a group for each line
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

            // update the elements that depend on scale width
            g.select('line')
                .attr(lineProperty, scaleWidth);
            g.select('g.' + handleTwo)
                .attr('transform', translation(scaleWidth, 0));

            // Update the text label
            g.select('text')
                .text(label);

            decorate(g, data, index);
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
}
