const webshot = require('webshot');
const fs = require('fs');
const path = require('path');

const bodyMargin = 8;
const width = 500;
const height = 250;

const config = {
    screenSize: {
        width: width + bodyMargin,
        height: height + bodyMargin
    },
    shotSize: {
        width: width,
        height: height
    },
    shotOffset: {
        left: bodyMargin,
        right: bodyMargin
    },
    renderDelay: 1000
};

fs.readdir('examples', function(err, files) {
    if (err) {
        console.error(err);
        return;
    }

    files.filter(file => file.substr(-4) === 'html')
        .forEach(file => {
            const url = 'http://localhost:8080/examples/' + file;
            const screenshot = 'screenshots/' + file.substr(0, file.length - 5) + '.png';
            webshot(url, screenshot, config, function(err) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Screenshot saved for ' + file);
            });
        });
});
