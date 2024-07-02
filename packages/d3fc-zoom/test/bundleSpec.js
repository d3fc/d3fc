import { JSDOM, VirtualConsole } from 'jsdom';

describe('bundle', function() {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        const virtualConsole = new VirtualConsole();
        virtualConsole.on('jsdomError', done); // Handle JSDOM errors

        const html = '<html><head></head><body></body></html>';
        const scripts = [
            require.resolve('d3/dist/d3.js'),
            require.resolve('../../../node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js'),
            require.resolve('../build/d3fc-zoom.js')
        ];

        const dom = new JSDOM(html, {
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole
        });

        dom.window.onload = () => {
            try {
                const zoom = dom.window.fc.zoom();
                expect(zoom).not.toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        };

        // Dynamically load scripts into the JSDOM environment
        scripts.forEach(src => {
            const scriptElement = dom.window.document.createElement('script');
            scriptElement.src = 'file://' + src;
            dom.window.document.head.appendChild(scriptElement);
        });

        // Set a timeout to ensure the test does not hang indefinitely
        jest.setTimeout(10000); // Extend timeout to 10 seconds (adjust as necessary)
    });
});
