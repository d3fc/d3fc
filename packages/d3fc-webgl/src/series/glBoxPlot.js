import projectedAttributeBuilder from '../buffers/projectedAttributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import boxPlotShader from '../shaders/boxPlot/shader';
import lineWidthShader from '../shaders/lineWidth';
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
    const verticesPerElement = 54;
    const program = programBuilder().verticesPerElement(verticesPerElement);
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    const decorate = () => {};
    const lineWidth = lineWidthShader();

    const xValueAttribute = projectedAttributeBuilder().value(
        (data, element) => data[element]
    );
    const yValueAttribute = projectedAttributeBuilder()
        .data({
            median: null,
            upperQuartile: null,
            lowerQuartile: null,
            high: null,
            low: null
        })
        .value((data, element, vertex) => {
            if ([18, 19, 20, 21, 22, 23].includes(vertex)) {
                return data.median[element];
            }
            if (
                [
                    8,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    30,
                    31,
                    33,
                    36,
                    37,
                    39
                ].includes(vertex)
            ) {
                return data.upperQuartile[element];
            }
            if (
                [
                    24,
                    25,
                    26,
                    27,
                    28,
                    29,
                    32,
                    34,
                    35,
                    38,
                    40,
                    41,
                    42,
                    43,
                    45
                ].includes(vertex)
            ) {
                return data.lowerQuartile[element];
            }
            if ([0, 1, 2, 3, 4, 5, 6, 7, 9].includes(vertex)) {
                return data.high[element];
            }
            if ([44, 46, 47, 48, 49, 50, 51, 52, 53].includes(vertex)) {
                return data.low[element];
            }
            return 0;
        });
    const xDirectionAttribute = projectedAttributeBuilder()
        .data([
            0,
            0,
            0,
            0,
            0,
            0,
            -1,
            1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            -1,
            1,
            -1,
            1,
            1,
            -1,
            -1,
            1,
            -1,
            1,
            1,
            -1,
            -1,
            1,
            0,
            0,
            0,
            0,
            0,
            0
        ])
        .value((data, element, vertex) => data[vertex]);
    const yDirectionAttribute = projectedAttributeBuilder()
        .data([
            1,
            1,
            -1,
            1,
            -1,
            -1,
            -1,
            -1,
            1,
            -1,
            1,
            1,
            1,
            1,
            -1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            1,
            -1,
            -1,
            -1,
            -1,
            1,
            -1,
            1,
            1,
            1,
            1,
            -1,
            1,
            -1,
            -1
        ])
        .value((data, element, vertex) => data[vertex]);
    const bandwidthAttribute = projectedAttributeBuilder()
        .data({ bandwidth: null, capWidth: null })
        .value((data, element, vertex) => {
            if (vertex <= 5 || vertex >= 48) {
                const value = data.capWidth[element];
                return [0, 3, 4, 48, 51, 52].includes(vertex) ? -value : value;
            }
            if (vertex > 11 && vertex < 42) {
                const value = data.bandwidth[element];
                return [
                    12,
                    15,
                    16,
                    18,
                    21,
                    22,
                    24,
                    27,
                    28,
                    30,
                    31,
                    32,
                    33,
                    34,
                    35
                ].includes(vertex)
                    ? -value
                    : value;
            }
            return 0;
        });

    const draw = numElements => {
        const shader = boxPlotShader();
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

    draw.medianValues = data => {
        const existing = yValueAttribute.data();
        yValueAttribute.data({ ...existing, median: data });
        return draw;
    };

    draw.upperQuartileValues = data => {
        const existing = yValueAttribute.data();
        yValueAttribute.data({ ...existing, upperQuartile: data });
        return draw;
    };

    draw.lowerQuartileValues = data => {
        const existing = yValueAttribute.data();
        yValueAttribute.data({ ...existing, lowerQuartile: data });
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
        const existing = bandwidthAttribute.data();
        bandwidthAttribute.data({ ...existing, bandwidth: data });
        return draw;
    };

    draw.capWidth = data => {
        const existing = bandwidthAttribute.data();
        bandwidthAttribute.data({ ...existing, capWidth: data });
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
