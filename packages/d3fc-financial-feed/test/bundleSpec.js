import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                // direct dependencies
                './node_modules/d3-fetch/dist/d3-fetch.js',
                './build/d3fc-financial-feed.js'
            ],
            done: (_, win) => {
                const gdaxFeed = win.fc.feedGdax();
                const quandlFeed = win.fc.feedQuandl();

                expect(gdaxFeed).toBeDefined();
                expect(quandlFeed).toBeDefined();
                done();
            }
        });
    });
});
