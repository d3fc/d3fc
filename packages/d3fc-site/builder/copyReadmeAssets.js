import fs from 'fs-promise';
import path from 'path';
import glob from 'glob';
import ensureExists from './ensureExists';

const root = path.resolve(__dirname, '../../..');
const apiDistFolder = path.resolve(root, 'packages/d3fc-site/dist/api');
const getDataFilename = (pathname) => path.join(root, pathname.replace(new RegExp('packages/d3fc-site/src/'), 'packages/d3fc-site/dist/'));
const getImageFilename = (pathname) => path.join(apiDistFolder, pathname.replace(new RegExp('packages/'), ''));

const globs = [
  { src: 'packages/d3fc-*/**/*.png', dest: getImageFilename },
  { src: 'packages/site/src/examples/**/*.{csv,json}', dest: getDataFilename }
];

export default (data) =>
  new Promise((resolve, reject) => {
    globs.forEach(entry => {
      glob(entry.src, { cwd: root, ignore: '**/node_modules/**/*' }, (err, files) => {
        if (err) {
          console.error('Finding README Images failed - ', err);
          reject(err);
        }

        const readPromises = files.map(filename => {
          const filepath = path.join(root, filename);
          const fileDestination = entry.dest(filename);
          return fs
            .readFile(filepath)
            .then(buffer => ensureExists(fileDestination).then(() => fs.writeFile(fileDestination, buffer)));
        });

        return Promise
          .all(readPromises)
          .then(() => resolve(data))
          .catch(reject);
      });
    });
  });
