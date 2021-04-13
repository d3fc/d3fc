import * as d3 from 'd3';
import { chartCanvasCartesian } from '../../index';
import { CartesianBaseChart } from '../../src/cartesianBase';
import { expectType } from 'tsd'
import { ScaleIdentity, ScaleLinear, scaleTime, scaleLinear } from 'd3';

describe('chartCanvasCartesian', () => {
    it('can accept zero scale parameters', () => {
        const chart = chartCanvasCartesian();
        expectType<CartesianBaseChart<ScaleIdentity, ScaleIdentity>>(chart);
    })

    it('can accept one scale parameter', () => {
        const chartWithFirstParameter = chartCanvasCartesian(d3.scaleLinear());
        expectType<CartesianBaseChart<ScaleLinear<number, number, never>, ScaleIdentity>>(chartWithFirstParameter);

        const chartWithSecondParameter = chartCanvasCartesian(undefined, d3.scaleLinear());
        expectType<CartesianBaseChart<d3.ScaleIdentity<never>, d3.ScaleLinear<number, number, never>>>(chartWithSecondParameter);
    })

    it('can accept two scale parameters', () => {
        const chart = chartCanvasCartesian(d3.scaleLinear(), scaleTime());
        expectType<CartesianBaseChart<d3.ScaleLinear<number, number, never>, d3.ScaleTime<number, number, never>>>(chart);
    })

    it('can accept a configuration object with one scale', () => {
        const chartWithYScale = chartCanvasCartesian({
            yScale: scaleLinear()
        });
        expectType<CartesianBaseChart<d3.ScaleIdentity, d3.ScaleLinear<number, number, never>>>(chartWithYScale);
    })

    it('can accept a configuration object with both scales', () => {
        const chartWithBothScales = chartCanvasCartesian({
            xScale: scaleLinear(),
            yScale: scaleLinear()
        });
        expectType<CartesianBaseChart<d3.ScaleLinear<number, number, never>, d3.ScaleLinear<number, number, never>>>(chartWithBothScales);
    })

    it('can accept a configuration object with optional xaxis, yaxis parameters', () => {
        const chartWithAxes = chartCanvasCartesian({
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
        expectType<CartesianBaseChart<d3.ScaleLinear<number, number, never>, d3.ScaleLinear<number, number, never>>>(chartWithAxes);
    })
});
