import attributeBuilder from '../buffers/attributeBuilder';
import uniformBuilder from '../buffers/uniformBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import errorBarShader from '../shaders/errorBar/shader';
import lineWidthShader from '../shaders/lineWidth';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
    let program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};
    let lineWidth = lineWidthShader();

    const xValueAttrib = 'aXValue';
    const yValueAttrib = 'aYValue';
    const xDirectionAttrib = 'aXDirection';
    const yDirectionAttrib = 'aYDirection';
    const bandwidthAttrib = 'aBandwidth';

    const yDirections = [0, 0, 0, 0, 0, 0, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1];
    const verticesPerElement = 18;

    const draw = (numElements) => {
        const shader = errorBarShader();
        program.vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        xScale.coordinate(0);
        xScale(program);
        yScale.coordinate(1);
        yScale(program);

        program.buffers().uniform('uScreen', uniformBuilder([
            program.context().canvas.width,
            program.context().canvas.height
        ]));

        lineWidth(program);

        program.vertexShader()
            .appendBody(`
                gl_Position.x += ((uWidth * aXDirection) + aBandwidth) / uScreen.x;
                gl_Position.y += (uWidth * aYDirection) / uScreen.y;
            `);

        decorate(program);

        program(numElements * verticesPerElement);
    };

    draw.xValues = (...args) => {
        const builder = program.buffers().attribute(xValueAttrib);
        let xArray = new Float32Array(args[0].length * verticesPerElement);
        xArray = xArray.map((_, i) => args[0][Math.floor(i / verticesPerElement)]);

        const xDirBuffer = program.buffers().attribute(xDirectionAttrib);
        let xDirArray = new Float32Array(args[0].length * verticesPerElement);
        const xDirections = [1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1];
        xDirArray = xDirArray.map((_, i) => xDirections[i % verticesPerElement]);

        if (builder) {
            builder.data(xArray);
            xDirBuffer.data(xDirArray);
        } else {
            program.buffers().attribute(xValueAttrib, attributeBuilder(xArray).components(1));
            program.buffers().attribute(xDirectionAttrib, attributeBuilder(xDirArray).components(1));
        }

        return draw;
    };
    
    draw.high = (...args) => {
        addToYBuffers(args[0], [2, 4, 5, 6, 7, 8, 9, 10, 11]);
        return draw;
    };

    draw.low = (...args) => {
        addToYBuffers(args[0], [0, 1, 3, 12, 13, 14, 15, 16, 17]);
        return draw;
    };

    draw.bandwidth = (...args) => {
        const builder = program.buffers().attribute(bandwidthAttrib);
        let bandwidthArray = new Float32Array(args[0].length * verticesPerElement);
        bandwidthArray = bandwidthArray.map((d, i) => {
            if ((i % verticesPerElement) > 5) {
                const val = args[0][Math.floor(i / verticesPerElement)];
                return [8, 10, 11, 12, 13, 15].includes(i % verticesPerElement) ?
                    -val :
                    val;
            } else {
                return d;
            }
        });

        if (builder) {
            builder.data(bandwidthArray);
        } else {
            program.buffers().attribute(bandwidthAttrib, attributeBuilder(bandwidthArray).components(1));
        }
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

    const addToYBuffers = (values, indexPositions) => {
        const yValBuffer = program.buffers().attribute(yValueAttrib);
        const yDirBuffer = program.buffers().attribute(yDirectionAttrib);
        let yArray = new Float32Array(values.length * verticesPerElement);
        let yDirArray = new Float32Array(values.length * verticesPerElement);

        if (yValBuffer) {
            const existingYValues = yValBuffer.data();
            yArray = yArray.map((_, i) => indexPositions.includes(i % verticesPerElement) ?
                values[Math.floor(i / verticesPerElement)] :
                existingYValues[i]
            );
            yValBuffer.data(yArray);

            const existingYDirValues = yDirBuffer.data();
            yDirArray = yDirArray.map((_, i) => indexPositions.includes(i % verticesPerElement) ?
                yDirections[i % verticesPerElement] :
                existingYDirValues[i]
            );
            yDirBuffer.data(yDirArray);
        } else {
            yArray = yArray.map((d, i) => indexPositions.includes(i % verticesPerElement) ?
                values[Math.floor(i / verticesPerElement)] :
                d
            );
            program.buffers().attribute(yValueAttrib, attributeBuilder(yArray).components(1));

            yDirArray = yDirArray.map((d, i) => indexPositions.includes(i % verticesPerElement) ?
                yDirections[i % verticesPerElement] :
                d
            );
            program.buffers().attribute(yDirectionAttrib, attributeBuilder(yDirArray).components(1));
        }
    };

    rebind(draw, program, 'context');
    rebind(draw, lineWidth, 'width');

    return draw;
};
