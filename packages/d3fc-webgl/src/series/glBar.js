import { rebind } from "@d3fc/d3fc-rebind"

import attributeBuilder from "../buffers/attributeBuilder"
import uniformBuilder from "../buffers/uniformBuilder"
import drawModes from "../program/drawModes"
import programBuilder from "../program/programBuilder"
import barShader from "../shaders/bar/shader"

export default () => {
    const program = programBuilder()

    // Attributes.
    const xValueAttrib = "aXValue", yValueAttrib = "aYValue"
    const widthValueAttrib = "aWidthValue"
    // Used to signal if vertex should be moved left = 0.0, or right = 1.0.
    const directionAttrib = "aDirection"
    const LEFT = 0.0, RIGHT = 1.0

    // Uniforms.
    const screenUniform = "uScreen"

    // Builder state.
    let xScale = null
    let yScale = null
    let decorate = program => {}
    let x = null
    let y0 = null
    let y1 = null
    let w = null

    const draw = (count) => {
        const shader = barShader()
        program.vertexShader(shader.vertex())
            .fragmentShader(shader.fragment())
            .mode(drawModes.TRIANGLES)

        // Scaling.
        xScale.coordinate(0)
        xScale(program)

        yScale.coordinate(1)
        yScale(program)

        xScale.scaleComponent(program, "origin")
        xScale.scaleComponent(program, "w")

        // Shader logic.
        program.vertexShader()
            .appendBody(`if (shouldMoveLeft) {
                gl_Position.x -= (w.x - origin.x) / 2.0;
            } else {
                gl_Position.x += (w.x - origin.x) / 2.0;
            }`)

        decorate(program)

        // Bind attribute buffers.
        // TODO: Optimisation this call doesn't need to be done every draw,
        //       only when changing the input data.
        const buffers = buildBuffers(x, y0, y1, w, count)
        bindBuffers(program, buffers)


        // Bind uniforms.
        program.buffers().uniform(screenUniform, uniformBuilder([
            program.context().canvas.width,
            program.context().canvas.height
        ]))

        // Draw.
        // Each bar has 6 vertices.
        const vertexCount = count * 6
        program(vertexCount)
    }

    // Builder methods.
    draw.xScale = (_xScale = undefined) => {
        if (_xScale === undefined) {
            return xScale
        }

        xScale = _xScale
        return draw
    }

    draw.yScale = (_yScale = undefined) => {
        if (_yScale === undefined) {
            return yScale
        }

        yScale = _yScale
        return draw
    }

    draw.decorate = (_decorate = undefined) => {
        if (_decorate === undefined) {
            return decorate
        }

        decorate = _decorate
        return draw
    }

    draw.x = (_x = undefined) => {
        if (_x === undefined) {
            return x
        }

        x = _x
        return draw
    }

    draw.y0 = (_y0 = undefined) => {
        if (_y0 === undefined) {
            return y0
        }

        y0 = _y0
        return draw
    }

    draw.y1 = (_y1 = undefined) => {
        if (_y1 === undefined) {
            return y1
        }

        y1 = _y1
        return draw
    }

    draw.w = (_w = undefined) => {
        if (_w === undefined) {
            return w
        }

        w = _w
        return draw
    }

    // Methods.
    const bindBuffers = (program, buffers) => {
        // Can this checking if buffer exists logic be wrapped up
        // into the new buffer buidler, seems a little tedious here.
        const xBuffer = program.buffers().attribute(xValueAttrib)
        const yBuffer = program.buffers().attribute(yValueAttrib)
        const wBuffer = program.buffers().attribute(widthValueAttrib)
        const dirBuffer = program.buffers().attribute(directionAttrib)

        const xArray = new Float32Array(buffers.x)
        const yArray = new Float32Array(buffers.y)
        const wArray = new Float32Array(buffers.w)
        const dirArray = new Float32Array(buffers.dir)

        if (xBuffer) {
            xBuffer.data(xArray)
            yBuffer.data(yArray)
            wBuffer.data(wArray)
            dirBuffer.data(dirArray)
        } else {
            program.buffers().attribute(xValueAttrib, attributeBuilder(xArray).components(1))
            program.buffers().attribute(yValueAttrib, attributeBuilder(yArray).components(1))
            program.buffers().attribute(widthValueAttrib, attributeBuilder(wArray).components(1))
            program.buffers().attribute(directionAttrib, attributeBuilder(dirArray).components(1))
        }
    }

    const buildBuffers = (x, y0, y1, w, count) => {
        const buffers = {
            x: [],
            y: [],
            w: [],
            dir: []
        }

        //     βL            β            βR
        //     .-------------.------------.
        // (x-w/2,y1)        (x,y1)   (x+w/2,y1)
        //     |     \                    |
        //     |        \                 |
        //     |           \              |
        //     |              \           |
        //     |                 \        |
        //     |                    \     |
        //     |                       \  |
        //     αL            α            αR
        //     .-------------.------------.
        // (x-w/2,y0)        (x,y0)   (x+w/2,y0)

        for (let i = 0; i < count; i++) {
            const xi = x[i], y0i = y0[i], y1i = y1[i], wi = w[i]

            // Triangle βL, αL, αR. (bottom)
            // For β -> βL.
            buffers.x.push(xi)
            buffers.y.push(y1i)
            buffers.w.push(wi)
            buffers.dir.push(LEFT)

            // For α -> αL.
            buffers.x.push(xi)
            buffers.y.push(y0i)
            buffers.w.push(wi)
            buffers.dir.push(LEFT)

            // For α -> αR.
            buffers.x.push(xi)
            buffers.y.push(y0i)
            buffers.w.push(wi)
            buffers.dir.push(RIGHT)

            // Triangle βL, αR, βR. (top)
            // For β -> βL.
            buffers.x.push(xi)
            buffers.y.push(y1i)
            buffers.w.push(wi)
            buffers.dir.push(LEFT)

            // For α -> αR.
            buffers.x.push(xi)
            buffers.y.push(y0i)
            buffers.w.push(wi)
            buffers.dir.push(RIGHT)

            // For β -> βR.
            buffers.x.push(xi)
            buffers.y.push(y1i)
            buffers.w.push(wi)
            buffers.dir.push(RIGHT)
        }

        return buffers
    }

    rebind(draw, program, "context")

    return draw
}
