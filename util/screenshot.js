const webshot = require('webshot');
const http = require('http');
const fs = require('fs');
const path = require('path');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

const bodyMargin = 8;
const width = 500;
const height = 250;
const port = 8080;

const config = {
    screenSize: {
        width: width + bodyMargin,
        height: height + bodyMargin
    },
    shotSize: {
        width: width,
        height: height
    },
    captureSelector: 'canvas, svg, body',
    errorIfJSException: true,
    errorIfStatusIsNot200: true
};

const takeScreenshots = () =>
  new Promise((resolve, reject) => {
      const dir = process.cwd()
      fs.readdir(process.cwd() + '/examples', function(err, files) {
          if (err) {
              console.error(err);
              return;
          }
          
        const pkgInfo = require(`${process.cwd()}/package.json`)
        const name = pkgInfo.name.replace('@d3fc/', '')
        console.log('Producing screenshots for package : ' + name)
        const promises = files
        .filter(file => file.substr(-4) === 'html')
        .map(file =>
            new Promise((resolve, reject) => {
                const url = `http://localhost:${port}/packages/${name}/examples/${file}`;
                const screenshot = path.resolve('screenshots', file.substr(0, file.length - 5)) + '.png';
                webshot(url, screenshot, config, (err) => {
                    if (err) {
                        reject(err);
                        console.error(`Failed to capture ${file} (${err})`);
                        return
                    }
                    console.log(`${screenshot} captured\n`)
                    resolve();
                });
            })
        );

        Promise.all(promises).then(resolve).catch(reject);
      });
  });
const serve = serveStatic('../..');

const server = http.createServer(function(req, res) {
    const done = finalhandler(req, res);
    serve(req, res, done);
});

server.listen(port, () =>
  takeScreenshots()
    .then(() => {
        console.error('Screenshots complete 📷');
        server.close();
    })
    .catch(err => {
        if (err) {
            console.error('Screenshots failed - ', err);
        }
        server.close();
    })
);
