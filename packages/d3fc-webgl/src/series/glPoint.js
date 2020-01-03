import projectedAttributeBuilder from '../buffers/projectedAttributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import circlePointShader from '../shaders/point/circle/baseShader';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let type = circlePointShader();
    let decorate = () => {};

    const xValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const yValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const sizeAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );

    const program = programBuilder().mode(drawModes.POINTS);

    program
        .buffers()
        .attribute('aXValue', xValueAttribute)
        .attribute('aYValue', yValueAttribute)
        .attribute('aSize', sizeAttribute);

    const draw = numElements => {
        program.vertexShader(type.vertex()).fragmentShader(type.fragment());

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        decorate(program);

        program(numElements);
    };

    draw.xValues = data => {
        xValueAttribute.data(data);
        return draw;
    };

    draw.yValues = data => {
        yValueAttribute.data(data);
        return draw;
    };

    draw.sizes = data => {
        sizeAttribute.data(data);
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

    draw.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
        return draw;
    };

    rebind(draw, program, 'context');

    return draw;
};
