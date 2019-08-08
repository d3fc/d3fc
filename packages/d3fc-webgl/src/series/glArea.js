import attributeBuilder from '../buffers/attributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import drawModes from '../program/drawModes';
import areaShader from '../shaders/area/shader';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xValueAttrib = 'aXValue';
    const xPreviousValueAttrib = 'aXPrevValue';
    const yValueAttrib = 'aYValue';
    const yPreviousValueAttrib = 'aYPrevValue';
    const y0ValueAttrib = 'aY0Value';
    const y0PreviousValueAttrib = 'aY0PrevValue';
    const cornerValueAttrib = 'aCorner';
    const definedAttrib = 'aDefined';

    const verticesPerElement = 6;

    const draw = numElements => {
        const shaderBuilder = areaShader();
        program
            .vertexShader(shaderBuilder.vertex())
            .fragmentShader(shaderBuilder.fragment())
            .mode(drawModes.TRIANGLES);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        decorate(program);

        program((numElements - 1) * verticesPerElement);
    };

    draw.xValues = (...args) => {
        const xBuffer = program.buffers().attribute(xValueAttrib);
        const xPreviousBuffer = program
            .buffers()
            .attribute(xPreviousValueAttrib);
        const cornerBuffer = program.buffers().attribute(cornerValueAttrib);

        let xArray = new Float32Array(
            (args[0].length - 1) * verticesPerElement
        );
        let xPreviousArray = new Float32Array(
            (args[0].length - 1) * verticesPerElement
        );
        let cornerArray = new Float32Array(
            (args[0].length - 1) * verticesPerElement * 3
        );

        xArray = xArray.map(
            (_, i) =>
                args[0][
                    Math.floor((i + verticesPerElement) / verticesPerElement)
                ]
        );
        xPreviousArray = xPreviousArray.map(
            (_, i) => args[0][Math.floor(i / verticesPerElement)]
        );
        const cornerValues = [
            0,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            1,
            0,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            0
        ];
        cornerArray = cornerArray.map(
            (_, i) => cornerValues[i % (verticesPerElement * 3)]
        );

        if (xBuffer) {
            xBuffer.data(xArray);
            xPreviousBuffer.data(xPreviousArray);
            cornerBuffer.data(cornerArray);
        } else {
            program
                .buffers()
                .attribute(
                    xValueAttrib,
                    attributeBuilder(xArray).components(1)
                );
            program
                .buffers()
                .attribute(
                    xPreviousValueAttrib,
                    attributeBuilder(xPreviousArray).components(1)
                );
            program
                .buffers()
                .attribute(
                    cornerValueAttrib,
                    attributeBuilder(cornerArray).components(3)
                );
        }
        return draw;
    };

    draw.yValues = (...args) => {
        const yBuffer = program.buffers().attribute(yValueAttrib);
        const yPreviousBuffer = program
            .buffers()
            .attribute(yPreviousValueAttrib);
        let yArray = new Float32Array(
            (args[0].length - 1) * verticesPerElement
        );
        let yPreviousArray = new Float32Array(
            (args[0].length - 1) * verticesPerElement
        );

        yArray = yArray.map(
            (_, i) =>
                args[0][
                    Math.floor((i + verticesPerElement) / verticesPerElement)
                ]
        );
        yPreviousArray = yPreviousArray.map(
            (_, i) => args[0][Math.floor(i / verticesPerElement)]
        );

        if (yBuffer) {
            yBuffer.data(yArray);
            yPreviousBuffer.data(yPreviousArray);
        } else {
            program
                .buffers()
                .attribute(
                    yValueAttrib,
                    attributeBuilder(yArray).components(1)
                );
            program
                .buffers()
                .attribute(
                    yPreviousValueAttrib,
                    attributeBuilder(yPreviousArray).components(1)
                );
        }
        return draw;
    };

    draw.y0Values = (...args) => {
        const y0Buffer = program.buffers().attribute(y0ValueAttrib);
        const y0PreviousBuffer = program
            .buffers()
            .attribute(y0PreviousValueAttrib);
        let y0Array = new Float32Array(
            (args[0].length - 1) * verticesPerElement
        );
        let y0PreviousArray = new Float32Array(
            (args[0].length - 1) * verticesPerElement
        );

        y0Array = y0Array.map(
            (_, i) =>
                args[0][
                    Math.floor((i + verticesPerElement) / verticesPerElement)
                ]
        );
        y0PreviousArray = y0PreviousArray.map(
            (_, i) => args[0][Math.floor(i / verticesPerElement)]
        );

        if (y0Buffer) {
            y0Buffer.data(y0Array);
            y0PreviousBuffer.data(y0PreviousArray);
        } else {
            program
                .buffers()
                .attribute(
                    y0ValueAttrib,
                    attributeBuilder(y0Array).components(1)
                );
            program
                .buffers()
                .attribute(
                    y0PreviousValueAttrib,
                    attributeBuilder(y0PreviousArray).components(1)
                );
        }
        return draw;
    };

    draw.defined = (...args) => {
        const definedBuffer = program.buffers().attribute(definedAttrib);

        const definedArray = new Float32Array(
            (args[0].length - 1) * verticesPerElement
        );
        const values = args[0];

        for (let i = 0; i < values.length - 1; i += 1) {
            const bufferIndex = i * verticesPerElement;
            const value = values[i] ? values[i + 1] : values[i];

            definedArray[bufferIndex] = definedArray[
                bufferIndex + 1
            ] = definedArray[bufferIndex + 2] = definedArray[
                bufferIndex + 3
            ] = definedArray[bufferIndex + 4] = definedArray[
                bufferIndex + 5
            ] = value;
        }

        if (definedBuffer) {
            definedBuffer.data(definedArray);
        } else {
            program
                .buffers()
                .attribute(
                    definedAttrib,
                    attributeBuilder(definedArray).components(1)
                );
        }
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

    return draw;
};
