import {line as lineShape} from 'd3-shape';
import {rebind, exclude, rebindAll} from '@d3fc/d3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const lineData = lineShape()
        .x((d, i) => base.values(d, i).transposedX)
        .y((d, i) => base.values(d, i).transposedY);

    const line = (data) => {
        const context = lineData.context();

        context.beginPath();

        context.strokeStyle = colors.black;
        context.fillStyle = 'transparent';

        base.decorate()(context, data);

        lineData.defined(base.defined())(data);

        context.fill();
        context.stroke();
        context.closePath();
    };

    rebindAll(line, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(line, lineData, 'curve', 'context');

    return line;
};
