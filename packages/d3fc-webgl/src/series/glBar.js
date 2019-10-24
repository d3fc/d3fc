import attributeBuilder from '../buffers/attributeBuilder';
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
    const program = programBuilder();

    // Builder state.
    let xScale = null;
    let yScale = null;
    let decorate = () => {};

    // Attributes.
    const xValueAttrib = 'aXValue';
    const yValueAttrib = 'aYValue';
    const widthValueAttrib = 'aWidthValue';
    const directionAttrib = 'aDirection';
    const LEFT = -1.0
    const RIGHT = 1.0;
    const verticesPerBar = 6;

    const draw = (numElements) => {
        const shader = barShader();
        program.vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES);

        // Scaling.
        xScale.coordinate(0);
        xScale(program);

        yScale.coordinate(1);
        yScale(program);

        xScale.scaleComponent(program, 'origin');
        xScale.scaleComponent(program, 'width');

        decorate(program);

        // Draw.
        program(numElements * verticesPerBar);
    };

    // Builder methods.
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

    draw.xValues = (...args) => {
        const builder = program.buffers().attribute(xValueAttrib);
        let xArray = new Float32Array(args[0].length * verticesPerBar);
        xArray = xArray.map((d, i) => args[0][Math.floor(i / verticesPerBar)]);

        const dirBuffer = program.buffers().attribute(directionAttrib);
        let dirArray = new Float32Array(args[0].length * verticesPerBar);
        dirArray = dirArray.map((d, i) => [0, 1, 3].includes(i % verticesPerBar) ? LEFT : RIGHT)

        if (builder) {
            builder.data(xArray);
            dirBuffer.data(dirArray);
        } else {
            program.buffers().attribute(xValueAttrib, attributeBuilder(xArray).components(1));
            program.buffers().attribute(directionAttrib, attributeBuilder(dirArray).components(1));
        }
        return draw;
    };

    draw.y0Values = (...args) => {
        const builder = program.buffers().attribute(yValueAttrib);

        if (builder) {
            const existingYValues = builder.data();
            let yArray = new Float32Array(existingYValues.length);
            yArray = yArray.map((d, i) => [1, 2, 4].includes(i % verticesPerBar) ? args[0][Math.floor(i / verticesPerBar)] : existingYValues[i]);
            builder.data(yArray);
        } else {
            let yArray = new Float32Array(args[0].length * verticesPerBar);
            yArray = yArray.map((d, i) => [1, 2, 4].includes(i % verticesPerBar) ? args[0][Math.floor(i / verticesPerBar)] : d);
            program.buffers().attribute(yValueAttrib, attributeBuilder(yArray).components(1));
        }

        return draw;
    };

    draw.y1Values = (...args) => {
        const builder = program.buffers().attribute(yValueAttrib);

        if (builder) {
            const existingYValues = builder.data();
            let yArray = new Float32Array(existingYValues.length);
            yArray = yArray.map((d, i) => [0, 3, 5].includes(i % verticesPerBar) ? args[0][Math.floor(i / verticesPerBar)] : existingYValues[i]);
            builder.data(yArray);
        } else {
            let yArray = new Float32Array(args[0].length * verticesPerBar);
            yArray = yArray.map((d, i) => [0, 3, 5].includes(i % verticesPerBar) ? args[0][Math.floor(i / verticesPerBar)] : d);
            program.buffers().attribute(yValueAttrib, attributeBuilder(yArray).components(1));
        }

        return draw;
    };

    draw.widths = (...args) => {
        const builder = program.buffers().attribute(widthValueAttrib);
        let widthArray = new Float32Array(args[0].length * verticesPerBar);
        widthArray = widthArray.map((d, i) => args[0][Math.floor(i / verticesPerBar)]);

        if (builder) {
            builder.data(widthArray);
        } else {
            program.buffers().attribute(widthValueAttrib, attributeBuilder(widthArray).components(1));
        }
        return draw;
    };

    rebind(draw, program, 'context');

    return draw;
};
