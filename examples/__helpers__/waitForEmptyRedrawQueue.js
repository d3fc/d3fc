module.exports.waitForEmptyRedrawQueue = async () => {
    await page.waitForFunction(() => document['__d3fc-elements__'] == null);
};
