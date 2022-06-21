module.exports.waitForEmptyRedrawQueue = async () => {
    await page.waitFor(() => document['__d3fc-elements__'] == null);
};
