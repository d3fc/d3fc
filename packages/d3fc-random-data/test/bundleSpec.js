import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo({
                error: fail
            }),
            scripts: [
                './node_modules/d3-random/build/d3-random.js',
                './node_modules/d3-time/build/d3-time.js',
                './node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js',
                './build/d3fc-random-data.js'
            ],
            done: (_, win) => {
                const generator = win.fc.randomFinancial();
                const result = generator(10);
                expect(result).not.toBeUndefined();
                done();
            }
        });
    });
});
