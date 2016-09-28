const webshot = require('webshot');
const http = require('http');
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const mkdirp = require('mkdirp');
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
    captureSelector: '.chart',
    errorIfJSException: true,
    errorIfStatusIsNot200: true
};

const takeScreenshots = () =>
  new Promise((resolve, reject) => {
      fs.readdir('examples', function(err, files) {
          if (err) {
              console.error(err);
              return;
          }

          files.filter(file => file.substr(-2) === 'js')
            .forEach(file => {
                const code = babel.transformFileSync(path.resolve('examples', file), {}).code;
                mkdirp.sync(path.resolve('examples/es5'));
                fs.writeFileSync(path.resolve('examples/es5', file), code);
            });

          console.log('Examples js transpiled into examples/es5');

          const promises = files
            .filter(file => file.substr(-4) === 'html')
            .map(file =>
              new Promise((resolve, reject) => {
                  const url = `http://localhost:${port}/examples/${file}`;
                  const screenshot = path.resolve('screenshots', file.substr(0, file.length - 5)) + '.png';
                  webshot(url, screenshot, config, (err) => {
                      if (err) {
                          reject(err);
                          return console.error(err);
                      }
                      resolve();
                      console.log('Screenshot saved for ' + file + ' at ' + screenshot);
                  });
              })
            );

          Promise.all(promises).then(resolve).catch(reject);
      });
  });

const serve = serveStatic('./');

const server = http.createServer(function(req, res) {
    const done = finalhandler(req, res);
    serve(req, res, done);
});

server.listen(port, () =>
  takeScreenshots()
    .then(() => {
        console.error('Screenshots successful');
        server.close();
    })
    .catch(err => {
        if (err) {
            console.error('Screenshots failed - ', err);
        }
        server.close();
    })
);
