import * as d3 from 'd3';
import chartCartesian, { CartesianChart } from '../src/cartesian';
import { expectType } from 'tsd'
import { ScaleIdentity, ScaleLinear, scaleTime, scaleLinear } from 'd3';

describe('chartCartesian', () => {
    it('can accept zero scale parameters', () => {
        const chart = chartCartesian();
        expectType<CartesianChart<ScaleIdentity, ScaleIdentity>>(chart);
    })

    it('can accept one scale parameter', () => {
        const chartWithFirstParameter = chartCartesian(d3.scaleLinear());
        expectType<CartesianChart<ScaleLinear<number, number, never>, ScaleIdentity>>(chartWithFirstParameter);

        const chartWithSecondParameter = chartCartesian(undefined, d3.scaleLinear());
        expectType<CartesianChart<d3.ScaleIdentity<never>, d3.ScaleLinear<number, number, never>>>(chartWithSecondParameter);
    })

    it('can accept two scale parameters', () => {
        const chart = chartCartesian(d3.scaleLinear(), scaleTime());
        expectType<CartesianChart<d3.ScaleLinear<number, number, never>, d3.ScaleTime<number, number, never>>>(chart);
    })

    it('can accept a configuration object with one scale', () => {
        const chartWithYScale = chartCartesian({
            yScale: scaleLinear()
        });
        expectType<CartesianChart<d3.ScaleIdentity, d3.ScaleLinear<number, number, never>>>(chartWithYScale);
    })

    it('can accept a configuration object with both scales', () => {
        const chartWithBothScales = chartCartesian({
            xScale: scaleLinear(),
            yScale: scaleLinear()
        });
        expectType<CartesianChart<d3.ScaleLinear<number, number, never>, d3.ScaleLinear<number, number, never>>>(chartWithBothScales);
    })

    it('can accept a configuration object with optional xaxis, yaxis parameters', () => {
        const chartWithAxes = chartCartesian({
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
        });
        expectType<CartesianChart<d3.ScaleLinear<number, number, never>, d3.ScaleLinear<number, number, never>>>(chartWithAxes);
    })

    it('rebinds scale methods as untyped methods', () => {
        const chart = chartCartesian(d3.scaleLinear(), d3.scaleLinear());
        const a = chart.xTickArguments()
        const b = chart.xTickArguments("an argument")
    })
});
