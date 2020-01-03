import projectedAttributeBuilder from '../buffers/projectedAttributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import errorBarShader from '../shaders/errorBar/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const program = programBuilder().verticesPerElement(18);
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    const decorate = () => {};
    const lineWidth = lineWidthShader();

    const xValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const yValueAttribute = projectedAttributeBuilder()
        .data({ high: null, low: null })
        .value((data, element, vertex) => {
            if ([2, 4, 5, 6, 7, 8, 9, 10, 11].includes(vertex)) {
                return data.high[element];
            }
            if ([0, 1, 3, 12, 13, 14, 15, 16, 17].includes(vertex)) {
                return data.low[element];
            }
            return 0;
        });
    const xDirectionAttribute = projectedAttributeBuilder()
        .data([1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1])
        .value((data, element, vertex) => data[vertex]);
    const yDirectionAttribute = projectedAttributeBuilder()
        .data([0, 0, 0, 0, 0, 0, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1])
        .value((data, element, vertex) => data[vertex]);
    const bandwidthAttribute = projectedAttributeBuilder().value(
        (data, element, vertex) => {
            if (vertex > 5) {
                const value = data[element];
                return [8, 10, 11, 12, 13, 15].includes(vertex)
                    ? -value
                    : value;
            }
            return 0;
        }
    );

    const draw = numElements => {
        const shader = errorBarShader();
        program
            .vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()

            .attribute('aXValue', xValueAttribute)
            .attribute('aYValue', yValueAttribute)
            .attribute('aXDirection', xDirectionAttribute)
            .attribute('aYDirection', yDirectionAttribute)
            .attribute('aBandwidth', bandwidthAttribute);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        lineWidth(program);

        program.vertexShader().appendBody(`
                gl_Position.x += ((uLineWidth * aXDirection) + aBandwidth) / uScreen.x;
                gl_Position.y += (uLineWidth * aYDirection) / uScreen.y;
            `);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.highValues = data => {
        const existing = yValueAttribute.data();
        yValueAttribute.data({ ...existing, high: data });
        return draw;
    };

    draw.lowValues = data => {
        const existing = yValueAttribute.data();
        yValueAttribute.data({ ...existing, low: data });
        return draw;
    };

    draw.bandwidth = data => {
        bandwidthAttribute.data(data);
        return draw;
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

    rebind(draw, program, 'context');
    rebind(draw, lineWidth, 'lineWidth');

    return draw;
};
