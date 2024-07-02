import { JSDOM, VirtualConsole } from 'jsdom';

describe('bundle', function() {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        const virtualConsole = new VirtualConsole();
        virtualConsole.on('error', done);

        const html = '<html></html>';
        const scripts = [
            require.resolve('d3/dist/d3.js'),
            require.resolve('../../../node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js'),
            require.resolve('../build/d3fc-random-data.js')
        ];

        const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', virtualConsole });

        scripts.forEach(src => {
            const scriptElement = dom.window.document.createElement('script');
            scriptElement.src = 'file://' + src;
            dom.window.document.head.appendChild(scriptElement);
        });

        dom.window.document.addEventListener('load', () => {
            try {
                const generator = dom.window.fc.randomFinancial();
                const result = generator(10);
                expect(result).not.toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        }, { once: true });
    });
});
