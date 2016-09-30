import fs from 'fs-promise';
import path from 'path';
import glob from 'glob';

const root = path.resolve(__dirname, '../../');
const apiDistFolder = path.resolve(root, 'site/dist/api');

const imageGlob = 'node_modules/d3fc-*/*.png';

const getImageFilename = (pathname) =>
  path.join(apiDistFolder, path.basename(pathname));

export default (data) =>
  new Promise((resolve, reject) => {
    glob(imageGlob, { cwd: root }, (err, files) => {
      if (err) {
        console.error('Finding README Images failed - ', err);
        reject(err);
      }

      const readPromises = files.map(filename => {
        const filepath = path.join(root, filename);
        return fs
          .readFile(filepath)
          .then(buffer => fs.writeFile(getImageFilename(filename), buffer));
      });

      return Promise
        .all(readPromises)
        .then(() => resolve(data))
        .catch(reject);
    });
  });
