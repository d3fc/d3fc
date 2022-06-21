it('should match the image snapshot goop', async () => {
    await d3fc.loadExample(module);
    const image = await page.screenshot({
        omitBackground: true
    });
    expect(image).toMatchImageSnapshot();
    await d3fc.saveScreenshot(module, image);
});
