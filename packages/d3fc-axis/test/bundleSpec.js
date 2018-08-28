import jsdom from 'jsdom';

describe('bundle', () => {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', (done) => {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo({
                error: fail
            }),
            scripts: [
                require.resolve('d3/dist/d3.js'),
                './node_modules/@d3fc/d3fc-data-join/build/d3fc-data-join.js',
                './node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js',
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
