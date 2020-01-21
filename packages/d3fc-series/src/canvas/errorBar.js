import { shapeErrorBar } from '@d3fc/d3fc-shape';
import { rebind, rebindAll } from '@d3fc/d3fc-rebind';
import errorBarBase from '../errorBarBase';
import colors from '../colors';

export default () => {

    const base = errorBarBase();

    const pathGenerator = shapeErrorBar()
        .value(0);

    const errorBar = (data) => {
        const filteredData = data.filter(base.defined());
        const context = pathGenerator.context();

        pathGenerator.orient(base.orient());

        filteredData.forEach((d, i) => {
            context.save();

            const values = base.values(d, i);
            context.translate(values.origin[0], values.origin[1]);
            context.beginPath();

            context.strokeStyle = colors.black;
            context.fillStyle = colors.gray;

            base.decorate()(context, d, i);

            pathGenerator.high(values.high)
                .width(values.width)
                .low(values.low)([d]);

            context.fill();
            context.stroke();
            context.closePath();

            context.restore();
        });
    };

    rebindAll(errorBar, base);
    rebind(errorBar, pathGenerator, 'context');

    return errorBar;
};
