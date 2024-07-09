import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';

describe('bundle', function() {
    it('should correctly wire-up all the dependencies via their UMD-exposed globals', function(done) {

        const virtualConsole = new VirtualConsole().sendTo({
            error: done
        });
        const dom = new JSDOM('<html></html>', { virtualConsole, runScripts: 'dangerously' },);

        const { window } = dom;

        const loadScript = (filePath) => {
            const scriptContent = fs.readFileSync(filePath, 'utf-8');
            const scriptElement = window.document.createElement('script');
            scriptElement.textContent = scriptContent;
            window.document.head.appendChild(scriptElement);
        };
        
        const scripts = [
            require.resolve('d3/dist/d3.js'),
            require.resolve('../build/d3fc-extent.js')
        ];

        scripts.forEach(loadScript);

        window.onload = () => {
            try {
                const extent = window.fc.extentLinear()([1, 2, 3, 4]);
                expect(extent).not.toBeUndefined();
                done();
            } catch (err) {
                done(err);
            }
        };
    });
});