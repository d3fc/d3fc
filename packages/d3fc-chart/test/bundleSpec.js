import jsdom from 'jsdom';

describe('bundle', () => {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', (done) => {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo({
                error: done
            }),
            scripts: [
                require.resolve('d3/dist/d3.js'),
                require.resolve('../node_modules/@d3fc/d3fc-data-join/build/d3fc-data-join.js'),
                require.resolve('../node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js'),
                require.resolve('../node_modules/@d3fc/d3fc-series/build/d3fc-series.js'),
                require.resolve('../node_modules/@d3fc/d3fc-axis/build/d3fc-axis.js'),
                require.resolve('../build/d3fc-chart.js')
            ],
            done: (_, win) => {
                const chart = win.fc.chartSvgCartesian();
                expect(chart).not.toBeUndefined();
                done();
            }
        });
    });
});
