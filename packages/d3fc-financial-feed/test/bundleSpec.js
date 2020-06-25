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
                require.resolve('../build/d3fc-financial-feed.js')
            ],
            done: (_, win) => {
                const gdaxFeed = win.fc.feedGdax();

                expect(gdaxFeed).toBeDefined();
                done();
            }
        });
    });
});
