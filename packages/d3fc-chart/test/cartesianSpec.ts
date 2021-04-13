import * as d3 from 'd3';
import chartCartesian, { CartesianChart } from '../src/cartesian';
import { expectType } from 'tsd'
import { ScaleIdentity, ScaleLinear } from 'd3';

describe('chartCartesian', () => {
    it('can accept zero scale parameters', () => {
        const chart = chartCartesian();
        expectType<CartesianChart<ScaleIdentity, ScaleIdentity>>(chart);
    })

    it('can accept one scale parameter', () => {
        const chartWithFirstParameter = chartCartesian(d3.scaleLinear());
        expectType<CartesianChart<ScaleLinear<number, number, never>, ScaleIdentity>>(chartWithFirstParameter);

        const chartWithSecondParameter = chartCartesian(undefined, d3.scaleLinear());
        expectType<CartesianChart<ScaleLinear<number, number, never>, ScaleIdentity>>(chartWithSecondParameter);
    })

    it('rebinds scale methods as untyped methods', () => {
        const chart = chartCartesian(d3.scaleLinear(), d3.scaleLinear());
        const a = chart.xTickArguments()
        const b = chart.xTickArguments("an argument")
    })
});
