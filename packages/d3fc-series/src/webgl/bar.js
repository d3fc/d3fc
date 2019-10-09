import xyBase from "../xyBase"
import { glBar, scaleMapper } from "@d3fc/d3fc-webgl"
import { exclude, rebind, rebindAll } from "@d3fc/d3fc-rebind"

export default () => {
    const base = xyBase()

    let context = null
    let xScale = null
    let yScale = null

    const draw = glBar()

    const bar = (data) => {
        const xScale = scaleMapper(base.xScale())
        const yScale = scaleMapper(base.yScale())

        const x = []
        const y0 = []
        const y1 = []
        const w = []
        data.forEach((datum, idx) => {
            x.push(base.crossValue()(datum, idx))
            y0.push(base.baseValue()(datum, idx))
            y1.push(base.mainValue()(datum, idx))
            w.push(base.bandwidth()(datum, idx))
        })

        draw.x(x)
            .y0(y0)
            .y1(y1)
            .w(w)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate(program => {
                base.decorate()(program, data, 0);
            })
        draw(data.length)
    }

    // Builder methods.
    bar.context = (_context = undefined) => {
        if (_context === undefined) {
            return context
        }

        context = _context
        return bar
    }

    // Rebinding methods.
    rebindAll(bar, base, exclude("align"))
    rebind(bar, draw, "context")

    return bar
}
