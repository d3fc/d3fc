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
                require.resolve('../build/d3fc-discontinuous-scale.js')
            ],
            done: (_, win) => {
                const scale = win.fc.scaleDiscontinuous();
                const scaled = scale(23);
                expect(scaled).not.toBeUndefined();
                done();
            }
        });
    });
});
