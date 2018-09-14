import {dataJoin} from '@d3fc/d3fc-data-join';
import {line as lineShape} from 'd3-shape';
import {select} from 'd3-selection';
import {rebind, exclude, rebindAll} from '@d3fc/d3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const lineData = lineShape()
        .x((d, i) => base.values(d, i).transposedX)
        .y((d, i) => base.values(d, i).transposedY);

    const join = dataJoin('path', 'line');

    const line = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        lineData.defined(base.defined());

        selection.each((data, index, group) => {
            const path = join(select(group[index]), [data]);

            path.enter()
              .attr('fill', 'none')
              .attr('stroke', colors.black);

            path.attr('d', lineData);

            base.decorate()(path, data, index);
        });
    };

    rebindAll(line, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(line, join, 'key');
    rebind(line, lineData, 'curve');

    return line;
};
