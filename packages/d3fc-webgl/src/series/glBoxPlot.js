import attributeBuilder from '../buffers/attributeBuilder';
import uniformBuilder from '../buffers/uniformBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import boxPlotShader from '../shaders/boxPlot/shader';
import lineWidthShader from '../shaders/line/width';
import drawModes from '../program/drawModes';
import { rebind } from '@d3fc/d3fc-rebind';

//           αL1     α     αR1
//            .------.------.
//                   |
//                   |
//                   |
//    βL2            β           βR2
//     .-------------.------------.
//     |                          |
//     |                          |
//     |                          |
//     γL2            γ           γR2
//     .-------------.------------.
//     |                          |
//     |                          |
//     |                          |
//    δL2            δ           δR2
//     .-------------.------------.
//                   |
//                   |
//                   |
//           εL1     ε     εR1
//            .------.------.

// Line drawing order
// αL1 -> αR1
// α -> β
// βL2 -> βR2
// γL2 -> γR2
// δL2 -> δR2
// βL2 -> δL2
// βR2 -> δR2
// δ -> ε
// εL1 -> εR1

export default () => {
    let program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const xValueAttrib = 'aXValue';
    const yValueAttrib = 'aYValue';
    const xDirectionAttrib = 'aXDirection';
    const yDirectionAttrib = 'aYDirection';
    const bandwidthAttrib = 'aBandwidth';

    const yDirections = [
        1, 1, -1, 1, -1, -1,
        -1, -1, 1, -1, 1, 1,
        1, 1, -1, 1, -1, -1,
        1, 1, -1, 1, -1, -1,
        1, 1, -1, 1, -1, -1,
        1, 1, -1, 1, -1, -1,
        1, 1, -1, 1, -1, -1,
        -1, -1, 1, -1, 1, 1,
        1, 1, -1, 1, -1, -1
    ];
    const verticesPerElement = 54;

    const draw = (numElements) => {
        const shader = boxPlotShader();
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

        lineWidthShader()(program);

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
        const xDirections = [
            0, 0, 0, 0, 0, 0,
            -1, 1, 1, -1, -1, 1,
            1, -1, -1, 1, 1, -1,
            1, -1, -1, 1, 1, -1,
            1, -1, -1, 1, 1, -1,
            -1, 1, 1, -1, -1, 1,
            -1, 1, 1, -1, -1, 1,
            -1, 1, 1, -1, -1, 1,
            0, 0, 0, 0, 0, 0
        ];
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

    draw.medianValues = (...args) => {
        addToYBuffers(args[0], [18, 19, 20, 21, 22, 23]);
        return draw;
    };

    draw.upperQuartileValues = (...args) => {
        addToYBuffers(args[0], [8, 10, 11, 12, 13, 14, 15, 16, 17, 30, 31, 33, 36, 37, 39]);
        return draw;
    };

    draw.lowerQuartileValues = (...args) => {
        addToYBuffers(args[0], [24, 25, 26, 27, 28, 29, 32, 34, 35, 38, 40, 41, 42, 43, 45]);
        return draw;
    };

    draw.highValues = (...args) => {
        addToYBuffers(args[0], [0, 1, 2, 3, 4, 5, 6, 7, 9]);
        return draw;
    };

    draw.lowValues = (...args) => {
        addToYBuffers(args[0], [44, 46, 47, 48, 49, 50, 51, 52, 53]);
        return draw;
    };

    draw.bandwidth = (...args) => {
        const builder = program.buffers().attribute(bandwidthAttrib);
        let bandwidthArray = new Float32Array(args[0].length * verticesPerElement);

        if (builder) {
            const existingBandwidths = builder.data();
            bandwidthArray = bandwidthArray.map((_, i) => {
                if ((i % verticesPerElement) > 11 && (i % verticesPerElement) < 42) {
                    const val = args[0][Math.floor(i / verticesPerElement)];
                    return [12, 15, 16, 18, 21, 22, 24, 27, 28, 30, 31, 32, 33, 34, 35].includes(i % verticesPerElement) ?
                        -val :
                        val;
                } else {
                    return existingBandwidths[i];
                }
            });
            builder.data(bandwidthArray);
        } else {
            bandwidthArray = bandwidthArray.map((d, i) => {
                if ((i % verticesPerElement) > 11 && (i % verticesPerElement) < 42) {
                    const val = args[0][Math.floor(i / verticesPerElement)];
                    return [12, 15, 16, 18, 21, 22, 24, 27, 28, 30, 31, 32, 33, 34, 35].includes(i % verticesPerElement) ?
                        -val :
                        val;
                } else {
                    return d;
                }
            });
            program.buffers().attribute(bandwidthAttrib, attributeBuilder(bandwidthArray).components(1));
        }

        return draw;
    };

    draw.capWidth = (...args) => {
        const builder = program.buffers().attribute(bandwidthAttrib);
        let bandwidthArray = new Float32Array(args[0].length * verticesPerElement);

        if (builder) {
            const existingBandwidths = builder.data();
            bandwidthArray = bandwidthArray.map((_, i) => {
                if ((i % verticesPerElement) <= 5 || (i % verticesPerElement) >= 48) {
                    const val = args[0][Math.floor(i / verticesPerElement)];
                    return [0, 3, 4, 48, 51, 52].includes(i % verticesPerElement) ?
                        -val :
                        val;
                } else {
                    return existingBandwidths[i];
                }
            });
            builder.data(bandwidthArray);
        } else {
            bandwidthArray = bandwidthArray.map((d, i) => {
                if ((i % verticesPerElement) <= 5 || (i % verticesPerElement) >= 48) {
                    const val = args[0][Math.floor(i / verticesPerElement)];
                    return [0, 3, 4, 48, 51, 52].includes(i % verticesPerElement) ?
                        -val :
                        val;
                } else {
                    return d;
                }
            });
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

    return draw;
};
