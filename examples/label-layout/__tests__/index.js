const { join } = require('path');

it('should match the image snapshot', async () => {
    await d3fc.loadExample(module);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
});

it('should look good on the website!', async () => {
    await d3fc.loadExample(module);
    const element = await page.$('svg');
    await element.screenshot({
        path: join(__dirname, '..', 'screenshot.png'),
        omitBackground: true
    });
});
