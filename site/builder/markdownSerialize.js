import { safeDump } from 'js-yaml';
import fs from 'fs-promise';
import path from 'path';
import changeCase from 'change-case';

const dist = (pathname) => path.resolve(__dirname, '../src/api', pathname);
const toTitle = (name) => {
  const parts = name.split('-');
  return changeCase.titleCase(parts.slice(0, parts.length - 1).join(' '));
};

function serialize(readme) {
  return `---
${safeDump(readme)}
---
`;
}

export default (readmes) =>
  new Promise((resolve, reject) => {
    console.log('YAML-IFYING READMES');

    readmes = readmes.map(readme => ({
      ...readme,
      layout: 'api',
      section: 'api',
      name: readme.name,
      title: toTitle(readme.name),
      structure: readme.structure,
      sidebarContents: readme.sidebarContents
    }));

    const writePromises = readmes.map(readme =>
      fs.writeFile(`${dist(readme.name.split('.')[0])}.md`, serialize(readme))
    );

    const readmeObject = {
      api: readmes
    };

    return Promise
      .all(writePromises)
      .then(() => console.log('DONE YAML-IFYING READMES'))
      .then(() => readmeObject)
      .then(resolve)
      .catch(reject);
  });
