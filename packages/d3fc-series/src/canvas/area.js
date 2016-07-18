import {area as areaShape} from 'd3-shape';
import {rebind, exclude, rebindAll} from 'd3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const areaData = areaShape()
        .defined(base.defined);

    const area = (data) => {
        const context = areaData.context();

        const projectedData = data.map(base.values);
        areaData.x((_, i) => projectedData[i].transposedX)
            .y((_, i) => projectedData[i].transposedY);

        const valueComponent = base.orient() === 'vertical' ? 'y' : 'x';
        areaData[valueComponent + '0']((_, i) => projectedData[i].y0);
        areaData[valueComponent + '1']((_, i) => projectedData[i].y);

        context.beginPath();
        areaData(data);
        context.fillStyle = colors.gray;

        base.decorate()(context, data);

        context.fill();
        context.closePath();
    };

    rebindAll(area, base, exclude('barWidth'));
    rebind(area, areaData, 'curve', 'context');

    return area;
};
