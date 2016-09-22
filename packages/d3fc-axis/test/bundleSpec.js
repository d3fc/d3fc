import jsdom from 'jsdom';

describe('bundle', () => {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', (done) => {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                // transitive dependencies
                './node_modules/d3-array/build/d3-array.js',
                './node_modules/d3-collection/build/d3-collection.js',
                './node_modules/d3-color/build/d3-color.js',
                './node_modules/d3-format/build/d3-format.js',
                './node_modules/d3-interpolate/build/d3-interpolate.js',
                './node_modules/d3-time-format/build/d3-time-format.js',
                // direct dependencies
                './node_modules/d3-shape/build/d3-shape.js',
                './node_modules/d3-scale/build/d3-scale.js',
                './node_modules/d3-selection/build/d3-selection.js',
                './node_modules/d3fc-data-join/build/d3fc-data-join.js',
                './node_modules/d3fc-rebind/build/d3fc-rebind.js',
                './build/d3fc-axis.js'
            ],
            done: (_, win) => {
                const axis = win.fc.axisBottom();
                expect(axis).not.toBeUndefined();
                done();
            }
        });
    });
});
