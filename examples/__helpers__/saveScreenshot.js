const { dirname, join } = require('path');
const { writeFile } = require('fs');
const { promisify } = require('util');

module.exports.saveScreenshot = async (module, image) => {
    const moduleDirname = dirname(module.filename);
    const path = join(moduleDirname, '..', 'screenshot.png');
    await promisify(writeFile)(path, image);
};
