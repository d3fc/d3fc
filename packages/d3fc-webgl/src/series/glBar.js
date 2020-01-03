import projectedAttributeBuilder from '../buffers/projectedAttributeBuilder';
import drawModes from '../program/drawModes';
import programBuilder from '../program/programBuilder';
import barShader from '../shaders/bar/shader';
import { rebind } from '@d3fc/d3fc-rebind';

//     βL            β            βR
//     .-------------.------------.
// (x-w/2, y1)    (x, y1)   (x+w/2, y1)
//     |     \                    |
//     |        \                 |
//     |           \              |
//     |              \           |
//     |                 \        |
//     |                    \     |
//     |                       \  |
//     αL            α            αR
//     .-------------.------------.
// (x-w/2, y0)     (x, y0)   (x+w/2, y0)

// Drawing order
// Triangle βL, αL, αR. (bottom)
// β -> βL.
// α -> αL.
// α -> αR.

// Triangle βL, αR, βR. (top)
// β -> βL.
// α -> αR.
// β -> βR.

export default () => {
    const program = programBuilder().verticesPerElement(6);
    let xScale = null;
    let yScale = null;
    let decorate = () => {};

    const xValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const yValueAttribute = projectedAttributeBuilder()
        .data([null, null])
        .value((data, element, vertex) => {
            const array = [1, 2, 4].includes(vertex) ? 0 : 1;
            return data[array][element];
        });
    const widthValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const directionAttribute = projectedAttributeBuilder()
        .size(2)
        .data([-1, -1, 1, -1, 1, 1])
        .value((data, element, vertex) => data[vertex]);

    const draw = numElements => {
        const shader = barShader();
        program
            .vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()
            .attribute('aXValue', xValueAttribute)
            .attribute('aYValue', yValueAttribute)
            .attribute('aWidthValue', widthValueAttribute)
            .attribute('aDirection', directionAttribute);

        xScale.coordinate(0);
        xScale(program);

        yScale.coordinate(1);
        yScale(program);

        xScale.scaleComponent(program, 'origin');
        xScale.scaleComponent(program, 'width');

        decorate(program);

        program(numElements);
    };

    draw.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return draw;
    };

    draw.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return draw;
    };

    draw.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return draw;
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.y0Values = data => {
        yValueAttribute.data([data, yValueAttribute.data()[1]]);
        return draw;
    };

    draw.yValues = data => {
        yValueAttribute.data([yValueAttribute.data()[0], data]);
        return draw;
    };

    draw.widths = data => {
        widthValueAttribute.data(data);
        return draw;
    };

    rebind(draw, program, 'context');

    return draw;
};
