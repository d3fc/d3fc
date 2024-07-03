import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';

describe('bundle', () => {

    it('should correctly wire-up all the dependencies via their UMD-exposed globals', (done) => {
        const virtualConsole = new VirtualConsole();
        virtualConsole.sendTo({ error: done });

        const dom = new JSDOM('<html></html>', {
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole,
        });

        const scriptPaths = [
            require.resolve('d3/dist/d3.js'),
            require.resolve('../../../node_modules/@d3fc/d3fc-data-join/build/d3fc-data-join.js'),
            require.resolve('../../../node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js'),
            require.resolve('../build/d3fc-label-layout.js'),
        ];

        try {
            scriptPaths.forEach(scriptPath => {
                const scriptContent = fs.readFileSync(scriptPath, 'utf8');
                dom.window.eval(scriptContent);
            });

            const { window } = dom;

            
            window.addEventListener('load', () => {
                try {
                    const label = window.fc.layoutLabel();
                    expect(label).not.toBeUndefined();
                    done();
                } catch (error) {
                    done(error);
                }
            });
        } catch (error) {
            done(error);
        }
    });
});
