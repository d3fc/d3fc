import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
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
                require.resolve('../node_modules/@d3fc/d3fc-shape/build/d3fc-shape.js'),
                require.resolve('../build/d3fc-annotation.js')
            ],
            done: (_, win) => {
                const result = win.fc.annotationSvgBand();
                expect(result).not.toBeUndefined();
                done();
            }
        });
    });
});
