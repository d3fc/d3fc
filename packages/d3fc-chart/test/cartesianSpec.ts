import * as d3 from 'd3';
import chartCartesian from '../src/cartesian';
import { expectType } from 'tsd'
import { tickFormat } from 'd3';

describe('chartCartesian', () => {
    it('definition has all of the properties specified in Object.keys', () => {
        const chart = chartCartesian(d3.scaleLinear(), d3.scaleLinear());

        expect(chart.canvasPlotArea).toBeDefined()
        expect(chart.chartLabel).toBeDefined()
        expect(chart.decorate).toBeDefined()
        expect(chart.svgPlotArea).toBeDefined()
        expect(chart.useDevicePixelRatio).toBeDefined()
        expect(chart.webglPlotArea).toBeDefined()
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

    it('has the correct types for canvasPlotArea', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.canvasPlotArea(null as unknown as any);
        expectType<typeof chart>(chart2)
        const canvasPlotArea = chart.canvasPlotArea()

    })

    it('has the correct types for chartLabel', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.chartLabel(null as unknown as any);
        expectType<typeof chart>(chart2)
        const chartLabel = chart.chartLabel()

    })

    it('has the correct types for decorate', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.decorate(null as unknown as any);
        expectType<typeof chart>(chart2)
        const decorate = chart.decorate()

    })

    it('has the correct types for svgPlotArea', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.svgPlotArea(null as unknown as any);
        expectType<typeof chart>(chart2)
        const svgPlotArea = chart.svgPlotArea()

    })

    it('has the correct types for useDevicePixelRatio', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.useDevicePixelRatio(null as unknown as any);
        expectType<typeof chart>(chart2)
        const useDevicePixelRatio = chart.useDevicePixelRatio()

    })

    it('has the correct types for webglPlotArea', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.webglPlotArea(null as unknown as any);
        expectType<typeof chart>(chart2)
        const webglPlotArea = chart.webglPlotArea()

    })

    it('has the correct types for xAxisHeight', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xAxisHeight(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xAxisHeight = chart.xAxisHeight()

    })

    it('has the correct types for xClamp', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xClamp(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xClamp = chart.xClamp()

    })

    it('has the correct types for xCopy', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xCopy(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xCopy = chart.xCopy()

    })

    it('has the correct types for xDecorate', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xDecorate(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xDecorate = chart.xDecorate()

    })

    it('has the correct types for xDomain', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xDomain([new Date()]);
        expectType<typeof chart>(chart2)
        const xDomain = chart.xDomain()

    })

    it('has the correct types for xInterpolate', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xInterpolate(null as unknown as any);
        expectType<typeof chart>(chart2)
        expect(chart2).not.toBe(chart);
        const xInterpolate = chart.xInterpolate()

    })

    it('has the correct types for xInvert', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xInvert(null as unknown as any);
        // expectType<typeof chart>(chart2)
        expect(chart2).not.toBe(chart);
        // const xInvert = chart.xInvert()

    })

    it('has the correct types for xLabel', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xLabel(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xLabel = chart.xLabel()

    })

    it('has the correct types for xNice', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xNice(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xNice = chart.xNice()

    })

    it('has the correct types for xOrient', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xOrient(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xOrient = chart.xOrient()

    })

    it('has the correct types for xTickArguments', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTickArguments(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTickArguments = chart.xTickArguments()

    })

    it('has the correct types for xTickCenterLabel', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTickCenterLabel(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTickCenterLabel = chart.xTickCenterLabel()

    })

    fit('has the correct types for xTickFormat', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const a = "test-string"
        const b = "test-string-2"
        chart.xTickFormat(a, b);

        const tickFormatArgs = chart.xTickFormat()
        const chartReturn = chart.xTickFormat(a)

        expect(tickFormatArgs).toEqual([a, b])
        expect(chartReturn).not.toBe(chart)
    })

    it('has the correct types for xTickPadding', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTickPadding(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTickPadding = chart.xTickPadding()

    })

    it('has the correct types for xTicks', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTicks(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTicks = chart.xTicks()

    })

    it('has the correct types for xTickSize', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTickSize(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTickSize = chart.xTickSize()
    })

    it('has the correct types for xTickSizeInner', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTickSizeInner(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTickSizeInner = chart.xTickSizeInner()

    })

    it('has the correct types for xTickSizeOuter', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTickSizeOuter(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTickSizeOuter = chart.xTickSizeOuter()

    })

    it('has the correct types for xTickValues', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xTickValues(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xTickValues = chart.xTickValues()

    })

    it('has the correct types for xUnknown', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.xUnknown(null as unknown as any);
        expectType<typeof chart>(chart2)
        const xUnknown = chart.xUnknown()

    })

    it('has the correct types for yAxisWidth', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yAxisWidth(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yAxisWidth = chart.yAxisWidth()

    })

    it('has the correct types for yClamp', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yClamp(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yClamp = chart.yClamp()

    })

    it('has the correct types for yCopy', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yCopy(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yCopy = chart.yCopy()

    })

    it('has the correct types for yDecorate', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yDecorate(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yDecorate = chart.yDecorate()

    })

    it('has the correct types for yDomain', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yDomain(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yDomain = chart.yDomain()

    })

    it('has the correct types for yInterpolate', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yInterpolate(null as unknown as any);
        // expectType<typeof chart>(chart2)
        expect(chart2).not.toBe(chart);

        const yInterpolate = chart.yInterpolate()

    })

    it('has the correct types for yInvert', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yInvert(null as unknown as any);
        // expectType<typeof chart>(chart2)
        expect(chart2).not.toBe(chart);
        //const yInvert = chart.yInvert()

    })

    it('has the correct types for yLabel', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yLabel(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yLabel = chart.yLabel()

    })

    it('has the correct types for yNice', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yNice(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yNice = chart.yNice()

    })

    it('has the correct types for yOrient', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yOrient(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yOrient = chart.yOrient()

    })

    it('has the correct types for yTickArguments', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickArguments(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickArguments = chart.yTickArguments()

    })

    it('has the correct types for yTickCenterLabel', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickCenterLabel(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickCenterLabel = chart.yTickCenterLabel()

    })

    it('has the correct types for yTickFormat', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickFormat(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickFormat = chart.yTickFormat()

    })

    it('has the correct types for yTickPadding', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickPadding(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickPadding = chart.yTickPadding()

    })

    it('has the correct types for yTicks', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTicks(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTicks = chart.yTicks()

    })

    it('has the correct types for yTickSize', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickSize(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickSize = chart.yTickSize()

    })

    it('has the correct types for yTickSizeInner', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickSizeInner(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickSizeInner = chart.yTickSizeInner()

    })

    it('has the correct types for yTickSizeOuter', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickSizeOuter(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickSizeOuter = chart.yTickSizeOuter()

    })

    it('has the correct types for yTickValues', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yTickValues(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yTickValues = chart.yTickValues()

    })

    it('has the correct types for yUnknown', () => {
        const chart = chartCartesian(d3.scaleTime(), d3.scaleLinear());
        const chart2 = chart.yUnknown(null as unknown as any);
        expectType<typeof chart>(chart2)
        const yUnknown = chart.yUnknown()
    })
});
