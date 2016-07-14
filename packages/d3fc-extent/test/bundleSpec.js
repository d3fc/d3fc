import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './node_modules/d3-array/build/d3-array.js',
                './build/d3fc-extent.js'
            ],
            done: (_, win) => {
                const extent = win.fc.linearExtent()([1, 2, 3, 4]);
                expect(extent).not.toBeUndefined();
                done();
            }
        });
    });
});
