const { join } = require('path');

it('should look good on the website!', async () => {
    await page.goto('file://' + join(__dirname, '..', 'index.html'));
    await page.screenshot({
        path: join(__dirname, '..', 'screenshot.png'),
        omitBackground: true
    });
});
