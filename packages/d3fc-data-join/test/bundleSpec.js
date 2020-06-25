import jsdom from 'jsdom';

describe('bundle', function() {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals (w/o d3-transition)', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo({
                error: done
            }),
            scripts: [
                require.resolve('d3/dist/d3.js'),
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
                error: done
            }),
            scripts: [
                require.resolve('d3/dist/d3.js'),
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
