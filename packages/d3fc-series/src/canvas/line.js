import {line as lineShape} from 'd3-shape';
import {rebind, exclude, rebindAll} from 'd3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const lineData = lineShape()
        .defined(base.defined)
        .x((d, i) => base.values(d, i).transposedX)
        .y((d, i) => base.values(d, i).transposedY);

    const line = (data) => {
        const context = lineData.context();

        context.beginPath();
        lineData(data);
        context.strokeStyle = colors.black;

        base.decorate()(context, data);

        context.stroke();
        context.closePath();
    };

    rebindAll(line, base, exclude('baseValue', 'barWidth'));
    rebind(line, lineData, 'curve', 'context');

    return line;
};
