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

    const highValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const lowValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const bandwidthAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    /*
     * x-y coordinate to locate the "corners" of the element (ie errorbar). The `z` coordinate locates the corner relative to the line (this takes line width into account).
     * X: -1: LEFT, 0: MIDDLE, 1: RIGHT
     * Y: -1: HIGH, 1: LOW
     * Z: Follows X or Y convention, depending on the orientation of the line that the vertex is part of.
     */
    const cornerAttribute = projectedAttributeBuilder()
        .size(3)
        .data([
            [0, 1, 1],
            [0, 1, -1],
            [0, -1, -1],
            [0, 1, 1],
            [0, -1, 1],
            [0, -1, -1],
            [1, -1, 1],
            [1, -1, -1],
            [-1, -1, -1],
            [1, -1, 1],
            [-1, -1, 1],
            [-1, -1, -1],
            [-1, 1, -1],
            [-1, 1, 1],
            [1, 1, 1],
            [-1, 1, -1],
            [1, 1, -1],
            [1, 1, 1]
        ])
        .value((data, element, vertex, component) => data[vertex][component]);

    const draw = numElements => {
        const shader = errorBarShader();
        program
            .vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        program
            .buffers()

            .attribute('aXValue', xValueAttribute)
            .attribute('aHighValue', highValueAttribute)
            .attribute('aLowValue', lowValueAttribute)
            .attribute('aBandwidth', bandwidthAttribute)
            .attribute('aCorner', cornerAttribute);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        lineWidth(program);

        program.vertexShader().appendBody(`
                gl_Position.x += xModifier / uScreen.x;
                gl_Position.y += yModifier / uScreen.y;
            `);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.highValues = data => {
        highValueAttribute.data(data);
        return draw;
    };

    draw.lowValues = data => {
        lowValueAttribute.data(data);
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
