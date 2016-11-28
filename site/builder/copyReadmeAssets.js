import fs from 'fs-promise';
import path from 'path';
import glob from 'glob';
import ensureExists from './ensureExists';

const root = path.resolve(__dirname, '../../');
const distFolder = path.resolve(root, '');
const apiDistFolder = path.resolve(root, 'site/dist/api');
const getDataFilename = (pathname) => path.join(distFolder, pathname.replace(new RegExp('site/src/'), 'site/dist/'));
const getImageFilename = (pathname) => path.join(apiDistFolder, pathname.replace(new RegExp('node_modules/'), ''));

const globs = [
  { src: 'node_modules/d3fc-*/**/*.png', dest: getImageFilename },
  { src: 'site/src/examples/**/*.{csv,json}', dest: getDataFilename }
];

export default (data) =>
  new Promise((resolve, reject) => {
    globs.forEach(entry => {
      glob(entry.src, { cwd: root }, (err, files) => {
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
