import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                // transitive dependencies
                './node_modules/d3-request/node_modules/d3-collection/build/d3-collection.js',
                './node_modules/d3-request/node_modules/d3-dispatch/build/d3-dispatch.js',
                './node_modules/d3-request/node_modules/d3-dsv/build/d3-dsv.js',
                // direct dependencies
                './node_modules/d3-request/build/d3-request.js',
                './build/d3fc-financial-feed.js'
            ],
            done: (_, win) => {
                const coinbaseFeed = win.fc.feedCoinbase()
                  .product('BTC-GBP');

                coinbaseFeed((_, data) => {
                    expect(data).not.toBeUndefined();
                    done();
                });
            }
        });
    });
});
