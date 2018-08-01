import mkdirp from 'mkdirp';
import path from 'path';

const ensureExists = (pathname, callback) =>
  new Promise((resolve, reject) =>
    mkdirp(path.dirname(pathname), (err) =>
      err ? reject(err) : resolve()
    )
);

export default ensureExists;
