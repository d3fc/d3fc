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
                require.resolve('../node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js'),
                require.resolve('../build/d3fc-technical-indicator.js')
            ],
            done: (_, win) => {
                const data = [0, 1, 6, 4, 8];
                const indicator = win.fc.indicatorMovingAverage();
                const transformed = indicator(data);
                expect(transformed).not.toBeUndefined();
                done();
            }
        });
    });
});
