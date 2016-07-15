import jsdom from 'jsdom';

describe('bundle', function() {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals (w/o d3-transition)', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './node_modules/d3-selection/build/d3-selection.js',
                './build/d3fc-data-join.js'
            ],
            done: (_, win) => {
                const dataJoin = win.fc.dataJoin();
                const selection = win.d3.select(win.document);
                dataJoin(selection, []);
                done();
            }
        });
    });
    it('should correctly wire-up all the dependencies via their UMD-exposed globals (w/ d3-transition)', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './node_modules/d3-selection/build/d3-selection.js',
                './node_modules/d3-color/build/d3-color.js',
                './node_modules/d3-dispatch/build/d3-dispatch.js',
                './node_modules/d3-ease/build/d3-ease.js',
                './node_modules/d3-interpolate/build/d3-interpolate.js',
                './node_modules/d3-timer/build/d3-timer.js',
                './node_modules/d3-transition/build/d3-transition.js',
                './build/d3fc-data-join.js'
            ],
            done: (_, win) => {
                const dataJoin = win.fc.dataJoin();
                const selection = win.d3.select(win.document);
                dataJoin(selection, []);
                done();
            }
        });
    });
});
