import jsdom from 'jsdom';

describe('bundle', function() {

    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './node_modules/d3/d3.js',
                './node_modules/d3fc-rebind/build/d3fc-rebind.js',
                './build/d3fc-label-layout.js'
            ],
            done: (_, win) => {
                const label = win.fc.label();
                expect(label).not.toBeUndefined();
                done();
            }
        });
    });
});
