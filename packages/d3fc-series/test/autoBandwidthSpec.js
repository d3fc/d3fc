import { scaleIdentity } from 'd3-scale';
import * as fc from '../index';

const mockSeries = () => {
    const xScale = scaleIdentity();
    const yScale = scaleIdentity();
    const crossValue = d => d;
    let bandwidth = null;

    const series  = () => {};

    series.defined = () => () => true;
    series.xScale = () => xScale;
    series.yScale = () => yScale;
    series.crossValue = () => crossValue;
    series.bandwidth = (...args) => {
        if (!args.length) {
            return bandwidth;
        }
        bandwidth = args[0];
        return series;
    };
    return series;
};

describe('Auto bandwidth calculation', () => {

    it('should default to 10', () => {
        const adaptee = fc.seriesCanvasBar();
        const autoBandwidth = fc.autoBandwidth(adaptee);

        autoBandwidth([]);

        expect(adaptee.bandwidth()()).toEqual(10);
    });

    it('should use the bandwidth property from the scale if present', () => {
        const scale = {
            bandwidth: () => 25
        };
        const adaptee = fc.seriesCanvasBar()
            .xScale(scale);
        const autoBandwidth = fc.autoBandwidth(adaptee);

        autoBandwidth([]);

        expect(adaptee.bandwidth()()).toEqual(25);
    });

    it('should use the orient property of the series to select the cross scale', () => {
        const xScale = {
            bandwidth: () => 25
        };
        const yScale = {
            bandwidth: () => 45
        };
        const adaptee = fc.seriesCanvasBar()
          .xScale(xScale)
          .yScale(yScale)
          .orient('horizontal');
        const autoBandwidth = fc.autoBandwidth(adaptee);

        autoBandwidth([]);

        expect(adaptee.bandwidth()()).toEqual(45);
    });

    it('should use the smallest distance between values to determine the width', () => {
        const adaptee = mockSeries();
        const autoBandwidth = fc.autoBandwidth(adaptee)
          .widthFraction(1);

        autoBandwidth([0, 5, 20, 30, 50]);

        expect(adaptee.bandwidth()).toEqual(5);
    });

    it('should allow the width to be controlled via the widthFraction property', () => {
        const adaptee = mockSeries();
        const autoBandwidth = fc.autoBandwidth(adaptee)
          .widthFraction(0.5);

        autoBandwidth([0, 4, 10]);

        expect(adaptee.bandwidth()).toEqual(2);
    });

    it('should sort the data values', () => {
        const adaptee = mockSeries();
        const autoBandwidth = fc.autoBandwidth(adaptee)
          .widthFraction(1);

        autoBandwidth([0, 10, 4]);

        expect(adaptee.bandwidth()).toEqual(4);
    });

    it('should use unique data value', () => {
        const adaptee = mockSeries();
        const autoBandwidth = fc.autoBandwidth(adaptee)
          .widthFraction(1);

        autoBandwidth([0, 4, 4, 10]);

        expect(adaptee.bandwidth()).toEqual(4);
    });

    it('should support series with xBandwidth and yBandwidth properties', () => {
        const xScale = {
            bandwidth: () => 25
        };
        const yScale = {
            bandwidth: () => 45
        };
        const adaptee = fc.seriesCanvasHeatmap()
          .xScale(xScale)
          .yScale(yScale);
        const autoBandwidth = fc.autoBandwidth(adaptee);

        autoBandwidth([]);

        expect(adaptee.xBandwidth()()).toEqual(25);
        expect(adaptee.yBandwidth()()).toEqual(45);
    });
});
