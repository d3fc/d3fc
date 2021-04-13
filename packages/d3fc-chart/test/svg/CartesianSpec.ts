import * as d3 from 'd3';
import { chartSvgCartesian } from '../../index';
import { CartesianBaseChart } from '../../src/cartesianBase';
import { expectType } from 'tsd'
import { ScaleIdentity, ScaleLinear, scaleTime, scaleLinear } from 'd3';

describe('chartSvgCartesian', () => {
    it('can accept zero scale parameters', () => {
        const chart = chartSvgCartesian();
        expectType<CartesianBaseChart<ScaleIdentity, ScaleIdentity>>(chart);
    })

    it('can accept one scale parameter', () => {
        const chartWithFirstParameter = chartSvgCartesian(d3.scaleLinear());
        expectType<CartesianBaseChart<ScaleLinear<number, number, never>, ScaleIdentity>>(chartWithFirstParameter);

        const chartWithSecondParameter = chartSvgCartesian(undefined, d3.scaleLinear());
        expectType<CartesianBaseChart<d3.ScaleIdentity<never>, d3.ScaleLinear<number, number, never>>>(chartWithSecondParameter);
    })

    it('can accept two scale parameters', () => {
        const chart = chartSvgCartesian(d3.scaleLinear(), scaleTime());
        expectType<CartesianBaseChart<d3.ScaleLinear<number, number, never>, d3.ScaleTime<number, number, never>>>(chart);
    })

    it('can accept a configuration object with one scale', () => {
        const chartWithYScale = chartSvgCartesian({
            yScale: scaleLinear()
        });
        expectType<CartesianBaseChart<d3.ScaleIdentity, d3.ScaleLinear<number, number, never>>>(chartWithYScale);
    })

    it('can accept a configuration object with both scales', () => {
        const chartWithBothScales = chartSvgCartesian({
            xScale: scaleLinear(),
            yScale: scaleLinear()
        });
        expectType<CartesianBaseChart<d3.ScaleLinear<number, number, never>, d3.ScaleLinear<number, number, never>>>(chartWithBothScales);
    })

    it('can accept a configuration object with optional xaxis, yaxis parameters', () => {
        const chartWithAxes = chartSvgCartesian({
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
