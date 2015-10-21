exports.config = {
    user: process.env.BROWSERSTACK_USER, //Username from https://www.browserstack.com/accounts/automate
    key: process.env.BROWSERSTACK_KEY, //Access Key from https://www.browserstack.com/accounts/automate
    updateJob: true,
    specs: [
        './tests/webdriver/*SpecWeb.js'
    ],
    exclude: [
    ],
    capabilities: [
        {
            browserName: 'chrome',
            'browserstack.local': true
        }
    ],
    logLevel: 'verbose',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: 'http://localhost:8000',
    waitforTimeout: 100000,
    framework: 'jasmine',
    reporter: 'dot',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 300000,
    },
    onPrepare: function() {
    },
    before: function() {
    },
    after: function(failures, pid) {
    },
    onComplete: function() {
    }
};
