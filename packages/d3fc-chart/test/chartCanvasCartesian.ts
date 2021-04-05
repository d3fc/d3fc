import * as d3 from 'd3';
import chartCartesian from '../src/canvas/cartesian';

describe('chartCanvasCartesian', () => {
    it('definition has all of the properties specified in Object.keys', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());

        expect(chart.chartLabel).toBeDefined()
        expect(chart.decorate).toBeDefined()
        expect(chart.plotArea).toBeDefined()
        expect(chart.xAxisHeight).toBeDefined()
        expect(chart.xClamp).toBeDefined()
        expect(chart.xCopy).toBeDefined()
        expect(chart.xDecorate).toBeDefined()
        expect(chart.xDomain).toBeDefined()
        expect(chart.xInterpolate).toBeDefined()
        expect(chart.xInvert).toBeDefined()
        expect(chart.xLabel).toBeDefined()
        expect(chart.xNice).toBeDefined()
        expect(chart.xOrient).toBeDefined()
        expect(chart.xTickArguments).toBeDefined()
        expect(chart.xTickCenterLabel).toBeDefined()
        expect(chart.xTickFormat).toBeDefined()
        expect(chart.xTickPadding).toBeDefined()
        expect(chart.xTicks).toBeDefined()
        expect(chart.xTickSize).toBeDefined()
        expect(chart.xTickSizeInner).toBeDefined()
        expect(chart.xTickSizeOuter).toBeDefined()
        expect(chart.xTickValues).toBeDefined()
        expect(chart.xUnknown).toBeDefined()
        expect(chart.yAxisWidth).toBeDefined()
        expect(chart.yClamp).toBeDefined()
        expect(chart.yCopy).toBeDefined()
        expect(chart.yDecorate).toBeDefined()
        expect(chart.yDomain).toBeDefined()
        expect(chart.yInterpolate).toBeDefined()
        expect(chart.yInvert).toBeDefined()
        expect(chart.yLabel).toBeDefined()
        expect(chart.yNice).toBeDefined()
        expect(chart.yOrient).toBeDefined()
        expect(chart.yTickArguments).toBeDefined()
        expect(chart.yTickCenterLabel).toBeDefined()
        expect(chart.yTickFormat).toBeDefined()
        expect(chart.yTickPadding).toBeDefined()
        expect(chart.yTicks).toBeDefined()
        expect(chart.yTickSize).toBeDefined()
        expect(chart.yTickSizeInner).toBeDefined()
        expect(chart.yTickSizeOuter).toBeDefined()
        expect(chart.yTickValues).toBeDefined()
        expect(chart.yUnknown).toBeDefined()
    })

});