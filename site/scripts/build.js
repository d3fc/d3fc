import fs from 'fs';
import build from '../builder/build';

const packageJSON = fs.readFileSync('./package.json');

const globalData = {
  package: JSON.parse(packageJSON),
  dev: process.env.NODE_ENV === 'dev'
};

globalData.baseurl = globalData.dev
  ? 'http://localhost:8080'
  : globalData.package.homepage;

const config = {
  destinationFolder: '../dist',
  filePattern: ['introduction/**/*.md', 'index.html', '404.md', 'examples/**/*.md', 'api/**/*.md'],
  globalData: globalData,
  sourceFolder: 'site/src'
};

build(config)
  .catch(err => console.error(err));
