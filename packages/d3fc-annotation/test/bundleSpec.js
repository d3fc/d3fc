import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './node_modules/d3-array/build/d3-array.js',
                './node_modules/d3-collection/build/d3-collection.js',
                './node_modules/d3-color/build/d3-color.js',
                './node_modules/d3-format/build/d3-format.js',
                './node_modules/d3-interpolate/build/d3-interpolate.js',
                './node_modules/d3-time/build/d3-time.js',
                './node_modules/d3-time-format/build/d3-time-format.js',
                './node_modules/d3-scale/build/d3-scale.js',
                './node_modules/d3-selection/build/d3-selection.js',
                './node_modules/d3fc-data-join/build/d3fc-data-join.js',
                './node_modules/d3fc-rebind/build/d3fc-rebind.js',
                './node_modules/d3-path/build/d3-path.js',
                './node_modules/d3fc-series/build/d3fc-series.js',
                './node_modules/d3fc-shape/build/d3fc-shape.js',
                './build/d3fc-annotation.js'
            ],
            done: (_, win) => {
                const result = win.fc.annotationSvgBand();
                expect(result).not.toBeUndefined();
                done();
            }
        });
    });
});
