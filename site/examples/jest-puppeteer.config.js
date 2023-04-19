module.exports = {
    launch: {
        headless: process.env.HEADLESS !== 'false',
        executablePath: process.env.EXECUTABLE_PATH
    }
};
