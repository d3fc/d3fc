import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';

describe('bundle', function() {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        const virtualConsole = new VirtualConsole().sendTo({
            error: done
        });
        const dom = new JSDOM('<html></html>', {
            virtualConsole,
            runScripts: 'dangerously'
        });

        const { window } = dom;

        const loadScript = filePath => {
            const scriptContent = fs.readFileSync(filePath, 'utf-8');
            const scriptElement = window.document.createElement('script');
            scriptElement.textContent = scriptContent;
            window.document.head.appendChild(scriptElement);
        };

        const nodeModules = global.nodeModulesPath;

        const scripts = [
            require.resolve(`${nodeModules}/d3/dist/d3.js`),
            require.resolve(
                `${nodeModules}/@d3fc/d3fc-shape/build/d3fc-shape.js`
            ),
            require.resolve(
                `${nodeModules}/@d3fc/d3fc-data-join/build/d3fc-data-join.js`
            ),
            require.resolve(
                `${nodeModules}/@d3fc/d3fc-rebind/build/d3fc-rebind.js`
            ),
            require.resolve(`../build/d3fc-series.js`),
        ];

        scripts.forEach(loadScript);

        window.onload = () => {
            try {
                const seriesSvgLine = window.fc.seriesSvgLine();
                expect(seriesSvgLine).not.toBeUndefined();
                done();
            } catch (err) {
                done(err);
            }
        };
    });
});
