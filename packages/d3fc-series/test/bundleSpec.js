import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                // include and other dependencies here ...
                './build/d3fc-series.js'
            ],
            done: (_, win) => {
                // simple exercise a code-path that includes all the dependencies
                const result = win.fc.archetypeConstant();
                expect(result).not.toBeUndefined();
                done();
            }
        });
    });
});
