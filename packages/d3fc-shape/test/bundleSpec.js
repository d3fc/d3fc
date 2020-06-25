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
                require.resolve('../build/d3fc-shape.js')
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
