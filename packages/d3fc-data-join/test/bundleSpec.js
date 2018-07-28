import jsdom from 'jsdom';

describe('bundle', function() {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals (w/o d3-transition)', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo({
                error: fail
            }),
            scripts: [
                require.resolve('d3-selection'),
                require.resolve('..')
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
            virtualConsole: jsdom.createVirtualConsole().sendTo({
                error: fail
            }),
            scripts: [
                require.resolve('d3-selection'),
                require.resolve('d3-color'),
                require.resolve('d3-dispatch'),
                require.resolve('d3-ease'),
                require.resolve('d3-interpolate'),
                require.resolve('d3-timer'),
                require.resolve('d3-transition'),
                require.resolve('..')
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
