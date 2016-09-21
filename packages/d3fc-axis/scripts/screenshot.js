const webshot = require('webshot');
const fs = require('fs');

const margin = 8;
const width = 400;
const height = 80;

const config = {
    screenSize: {
        width: width + margin * 2,
        height: height + margin * 2
    },
    shotSize: {
        width: width + margin * 2,
        height: height + margin * 2
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
