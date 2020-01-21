import { shapeBoxPlot } from '@d3fc/d3fc-shape';
import { rebind, rebindAll } from '@d3fc/d3fc-rebind';
import boxPlotBase from '../boxPlotBase';
import colors from '../colors';

export default () => {

    const base = boxPlotBase();

    const pathGenerator = shapeBoxPlot()
        .value(0);

    const boxPlot = (data) => {
        const filteredData = data.filter(base.defined());
        const context = pathGenerator.context();

        pathGenerator.orient(base.orient());

        filteredData.forEach((d, i) => {
            context.save();

            const values = base.values(d, i);
            context.translate(values.origin[0], values.origin[1]);
            context.beginPath();

            context.fillStyle = colors.gray;
            context.strokeStyle = colors.black;

            base.decorate()(context, d, i);

            pathGenerator.median(values.median)
                .upperQuartile(values.upperQuartile)
                .lowerQuartile(values.lowerQuartile)
                .high(values.high)
                .width(values.width)
                .low(values.low)([d]);

            context.fill();
            context.stroke();
            context.closePath();

            context.restore();
        });
    };

    rebindAll(boxPlot, base);
    rebind(boxPlot, pathGenerator, 'cap', 'context');

    return boxPlot;
};
