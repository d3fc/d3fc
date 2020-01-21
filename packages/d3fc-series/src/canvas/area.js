import {area as areaShape} from 'd3-shape';
import {rebind, exclude, rebindAll} from '@d3fc/d3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const areaData = areaShape();

    const area = (data) => {
        const context = areaData.context();

        areaData.defined(base.defined());

        const projectedData = data.map(base.values);
        areaData.x((_, i) => projectedData[i].transposedX)
            .y((_, i) => projectedData[i].transposedY);

        const valueComponent = base.orient() === 'vertical' ? 'y' : 'x';
        areaData[valueComponent + '0']((_, i) => projectedData[i].y0);
        areaData[valueComponent + '1']((_, i) => projectedData[i].y);

        context.beginPath();

        context.fillStyle = colors.gray;
        context.strokeStyle = 'transparent';

        base.decorate()(context, data);

        areaData(data);

        context.fill();
        context.stroke();
        context.closePath();
    };

    rebindAll(area, base, exclude('bandwidth', 'align'));
    rebind(area, areaData, 'curve', 'context');

    return area;
};
