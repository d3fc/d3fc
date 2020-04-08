const { join } = require('path');

it('should look good on the website!', async () => {
    await d3fc.loadExample(module);
    await page.screenshot({
        path: join(__dirname, '..', 'screenshot.png'),
        omitBackground: true
    });
});
