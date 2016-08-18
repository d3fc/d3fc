const webshot = require('webshot');
const fs = require('fs');
const path = require('path');

const width = 500;
const height = 250;

const config = {
    errorIfJSException: true,
    screenSize: {
        width: width,
        height: height
    },
    shotSize: {
        width: width,
        height: height
    }
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
