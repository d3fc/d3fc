import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import xyBase from './xyBase';

export default function () {

    var decorate = noop;

    var base = xyBase();

    var areaData = d3.svg.area()
        .defined(base.defined)
        .x(base.x)
        .y0(base.y0)
        .y1(base.y1);

    var dataJoin = dataJoinUtil()
        .selector('path.area')
        .element('path')
        .attr('class', 'area');

    var area = function (selection) {

        selection.each(function (data, index) {

            var path = dataJoin(this, [data]);
            path.attr('d', areaData);

            decorate(path, data, index);
        });
    };

    area.decorate = function (x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return area;
    };

    d3.rebind(area, base, 'xScale', 'xValue', 'yScale', 'yValue', 'y1Value', 'y0Value');
    d3.rebind(area, dataJoin, 'key');
    d3.rebind(area, areaData, 'interpolate', 'tension');

    return area;
}
