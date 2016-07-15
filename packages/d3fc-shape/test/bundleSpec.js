import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './node_modules/d3-path/build/d3-path.js',
                './build/d3fc-shape.js'
            ],
            done: (_, win) => {
                const shape = win.fc.shapeBar();
                const data = [{x: 10, y: 10, height: 22}];
                const result = shape(data);
                expect(result).not.toBeUndefined();
                done();
            }
        });
    });
});
