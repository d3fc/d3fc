import fs from 'fs';
import build from '../builder/build';

const packageJSON = fs.readFileSync('./package.json');

const globalData = {
  package: JSON.parse(packageJSON),
  dev: true
};

globalData.baseurl = globalData.dev
  ? 'http://localhost:8000'
  : globalData.package.homepage;

const config = {
  destinationFolder: '../dist',
  filePattern: ['components/**/*.md', '**/index.html', 'examples/**/*.md', 'api/**/*.md'],
  globalData: globalData,
  sourceFolder: 'site/src'
};

build(config)
  .catch(err => console.error(err));
