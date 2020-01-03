import projectedAttributeBuilder from '../buffers/projectedAttributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import rectShader from '../shaders/rect/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const program = programBuilder().verticesPerElement(12);
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    const lineWidth = lineWidthShader();
    let decorate = () => {};

    const xValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const yValueAttribute = projectedAttributeBuilder()
        .data({ open: null, high: null, low: null, close: null })
        .value((data, element, vertex) => {
            if ([6, 7, 9].includes(vertex)) {
                return data.open[element];
            }
            if ([2, 4, 5].includes(vertex)) {
                return data.high[element];
            }
            if ([0, 1, 3].includes(vertex)) {
                return data.low[element];
            }
            if ([8, 10, 11].includes(vertex)) {
                return data.close[element];
            }
            return 0;
        });
    const xDirectionAttribute = projectedAttributeBuilder()
        .data([1, -1, -1, 1, 1, -1, 1, -1, -1, 1, 1, -1])
        .value((data, element, vertex) => data[vertex]);
    const yDirectionAttribute = projectedAttributeBuilder().value(
        (data, element, vertex) => {
            const openVal = data.open[element];
            const closeVal = data.close[element];
            if ([6, 7, 8, 9, 10, 11].includes(vertex)) {
                const openValMin = Math.min(openVal, closeVal) === openVal;
                if ([6, 7, 9].includes(vertex)) {
                    return openValMin ? -1 : 1;
                } else {
                    return openValMin ? 1 : -1;
                }
            }
            return 0;
        }
    );
    const bandwidthAttribute = projectedAttributeBuilder().value(
        (data, element, vertex) => {
            if (vertex >= 6 && vertex <= 11) {
                const value = data[element];
                return [6, 9, 10].includes(vertex) ? value : -value;
            }
            return 0;
        }
    );
    const colorIndicatorAttribute = projectedAttributeBuilder().value(
        (data, element, vertex) => {
            const openVal = data.open[element];
            const closeVal = data.close[element];
            return openVal < closeVal ? 1 : -1;
        }
    );

    const draw = numElements => {
        const shaderBuilder = rectShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()
            .attribute('aXValue', xValueAttribute)
            .attribute('aYValue', yValueAttribute)
            .attribute('aXDirection', xDirectionAttribute)
            .attribute('aYDirection', yDirectionAttribute)
            .attribute('aBandwidth', bandwidthAttribute)
            .attribute('aColorIndicator', colorIndicatorAttribute);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        lineWidth(program);

        program.vertexShader().appendBody(`
        gl_Position.x += ((uLineWidth * aXDirection / 2.0) + (aBandwidth / 2.0)) / uScreen.x;
        gl_Position.y += (uLineWidth * aYDirection / 2.0) / uScreen.y;
      `);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.openValues = data => {
        const existing = yValueAttribute.data();
        const updated = { ...existing, open: data };
        yValueAttribute.data(updated);
        yDirectionAttribute.data(updated);
        colorIndicatorAttribute.data(updated);
        return draw;
    };

    draw.highValues = data => {
        const existing = yValueAttribute.data();
        const updated = { ...existing, high: data };
        yValueAttribute.data(updated);
        yDirectionAttribute.data(updated);
        colorIndicatorAttribute.data(updated);
        return draw;
    };

    draw.lowValues = data => {
        const existing = yValueAttribute.data();
        const updated = { ...existing, low: data };
        yValueAttribute.data(updated);
        yDirectionAttribute.data(updated);
        colorIndicatorAttribute.data(updated);
        return draw;
    };

    draw.closeValues = data => {
        const existing = yValueAttribute.data();
        const updated = { ...existing, close: data };
        yValueAttribute.data(updated);
        yDirectionAttribute.data(updated);
        colorIndicatorAttribute.data(updated);
        return draw;
    };

    draw.bandwidth = data => {
        bandwidthAttribute.data(data);
        return draw;
    };

    draw.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
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
