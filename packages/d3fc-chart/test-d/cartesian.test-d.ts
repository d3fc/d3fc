import * as d3 from 'd3';
import { chartCartesian } from '../index';
import { CanvasPlotAreaComponent, CartesianChart, SvgPlotAreaComponent, WebglPlotAreaComponent } from '../src/cartesian';
import { expectType } from 'tsd';
import { ScaleIdentity, ScaleLinear, scaleTime, scaleLinear } from 'd3';

// Can accept zero scale parameters
expectType<CartesianChart<ScaleIdentity, ScaleIdentity>>(chartCartesian());

// Can accept one scale parameter
expectType<CartesianChart<ScaleLinear<number, number, never>, ScaleIdentity>>(chartCartesian(d3.scaleLinear()));

expectType<CartesianChart<d3.ScaleIdentity<never>, d3.ScaleLinear<number, number, never>>>(chartCartesian(undefined, d3.scaleLinear()));

// Can accept two scale parameters
expectType<CartesianChart<d3.ScaleLinear<number, number, never>, d3.ScaleTime<number, number, never>>>(chartCartesian(d3.scaleLinear(), scaleTime()));

// Can accept a configuration object with one scale
expectType<CartesianChart<d3.ScaleIdentity, d3.ScaleLinear<number, number, never>>>(chartCartesian({
    yScale: scaleLinear()
}));

// Can accept a configuration object with both scales
expectType<CartesianChart<d3.ScaleLinear<number, number, never>, d3.ScaleLinear<number, number, never>>>(chartCartesian({
    xScale: scaleLinear(),
    yScale: scaleLinear()
}));

// Can accept a configuration object with optional xaxis, yaxis parameters
expectType<CartesianChart<d3.ScaleLinear<number, number, never>, d3.ScaleLinear<number, number, never>>>(chartCartesian({
    xScale: scaleLinear(),
    yScale: scaleLinear(),
    xAxis: {
        top: null,
        bottom: null
    },
    yAxis: {
        left: null,
        right: null
    }
}));


const chart = chartCartesian(d3.scaleLinear(), d3.scaleLinear());

// Has rebound scale methods as any-typed methods
expectType<(...args: any[]) => any>(chart.xInterpolate);
expectType<any>(chart.xInterpolate());
expectType<any>(chart.xInterpolate("an argument"));

// Has rebound axis methods as any-typed methods
expectType<(...args: any[]) => any>(chart.xTickArguments);

expectType<any>(chart.xTickFormat());
expectType<any>(chart.xTicks());
expectType<any>(chart.xTickArguments());
expectType<any>(chart.xTickSize());
expectType<any>(chart.xTickSizeInner());
expectType<any>(chart.xTickSizeOuter());
expectType<any>(chart.xTickValues());
expectType<any>(chart.xTickPadding());
expectType<any>(chart.xTickCenterLabel());

// Has methods specific to cartesian instances
expectType<WebglPlotAreaComponent | null>(chart.webglPlotArea());
expectType<CanvasPlotAreaComponent | null>(chart.canvasPlotArea());
expectType<SvgPlotAreaComponent | null>(chart.svgPlotArea());
expectType<boolean>(chart.useDevicePixelRatio());

// Correctly rebinds methods from non ScaleIdentity scales
const chartScaleBand = chartCartesian(d3.scaleBand(), d3.scaleLinear());
expectType<any>(chartScaleBand.xPadding());
expectType<any>(chartScaleBand.xPadding(5));

expectType<any>(chartScaleBand.yNice());
expectType<any>(chartScaleBand.yNice(5));
