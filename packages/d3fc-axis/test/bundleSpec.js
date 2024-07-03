import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';

describe('bundle', () => {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', async () => {
        const virtualConsole = new VirtualConsole();
        const dom = new JSDOM('<html></html>', {
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole,
        });

        return new Promise((resolve, reject) => {
            virtualConsole.on('error', reject);

            const scriptPaths = [
                require.resolve('d3/dist/d3.js'),
                require.resolve('../../../node_modules/@d3fc/d3fc-data-join/build/d3fc-data-join.js'),
                require.resolve('../../../node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js'),
                require.resolve('../build/d3fc-axis.js'),
            ];

            try {
                for (const scriptPath of scriptPaths) {
                    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
                    dom.window.eval(scriptContent);
                }
                
                const { window } = dom;

                
                window.addEventListener('load', () => {
                    try {
                        const axis = window.fc.axisBottom();
                        expect(axis).not.toBeUndefined();
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    });
});
