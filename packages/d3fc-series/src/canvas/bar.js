import {shapeBar} from '@d3fc/d3fc-shape';
import {rebind, rebindAll} from '@d3fc/d3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const base = xyBase();

    const pathGenerator = shapeBar()
        .x(0)
        .y(0);

    const valueAxisDimension = (generator) =>
        base.orient() === 'vertical' ? generator.height : generator.width;

    const crossAxisDimension = (generator) =>
        base.orient() === 'vertical' ? generator.width : generator.height;

    const bar = (data) => {
        const context = pathGenerator.context();

        const filteredData = data.filter(base.defined());
        const projectedData = filteredData.map(base.values);

        if (base.orient() === 'vertical') {
            pathGenerator.verticalAlign('top');
            pathGenerator.horizontalAlign('center');
        } else {
            pathGenerator.horizontalAlign('right');
            pathGenerator.verticalAlign('center');
        }

        projectedData.forEach((datum, i) => {
            context.save();
            context.beginPath();
            context.translate(datum.origin[0], datum.origin[1]);

            context.fillStyle = colors.darkGray;
            context.strokeStyle = 'transparent';
            base.decorate()(context, datum.d, i);

            valueAxisDimension(pathGenerator)(-datum.height);
            crossAxisDimension(pathGenerator)(datum.width);
            pathGenerator([datum]);

            context.fill();
            context.stroke();

            context.closePath();
            context.restore();
        });
    };

    rebindAll(bar, base);
    rebind(bar, pathGenerator, 'context');

    return bar;
};
