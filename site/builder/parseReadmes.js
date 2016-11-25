import changeCase from 'change-case';
import { AllHtmlEntities } from 'html-entities';

const entities = new AllHtmlEntities();
const any = '\\n|\\r|.';
const title = `(.+)`;
const hashes = level => Array(level).fill('#').join('');
const createBlockPattern = (level) => new RegExp(
  `(${hashes(level)}\\s${title}(?:${any})+?` +
  `(?=(?:\\n${hashes(level)}\\s))|` +
  `${hashes(level)}\\s${title}(?:${any})+?\\n$)`,
  'g'
);

function parseBlock(level, content, title, options) {
  let match, firstChildIndex;
  const children = [];
  const regex = createBlockPattern(level);

  if (content && title && title.indexOf('d3fc') >= 0) {
    content = content.replace(/"screenshots\//g, `"${title}/screenshots/`);
    content = content.replace(/((\(.+)\.png)/g, (match, fileName) =>  `(${title}/${fileName.replace(/\(|\)/g, '')})`);
  }

  if (level <= options.maxDepth) {
    while ((match = regex.exec(content)) !== null) {

      const childContent = match[0];
      const childTitle = match[2] || match[3];
      children.push(parseBlock(level + 1, childContent, childTitle, options));

      if (!firstChildIndex) {
        firstChildIndex = match.index;
      }
    }
  }

  if (level === 1) {
    return children;
  } else {
    const block = {
      shouldLinkToGH: title.indexOf('d3fc-') >= 0,
      title: entities.decode(title),
      level: level - 1,
      content: (
        children.length
          ? content.substr(0, firstChildIndex)
          : content
      ).replace(new RegExp(`${hashes(level - 1)} ${title}(\n|\r)+`), '')
    };
    if (children.length) {
      block.children = children;
    }
    return block;
  }
}

function getContents(readme) {
  try {
    return readme.structure[0].children[1].children || [];
  } catch (e) {
    return [];
  }
}

function parseReadme(readme) {
  readme.structure = parseBlock(1, readme.contents, null, { maxDepth: 3 });
  readme.sidebarContents = getContents(readme).map(block => ({
    title: block.title,
    id: changeCase.paramCase(block.title)
  }));
  return readme;
}

export default (readmes) =>
  new Promise((resolve, reject) => {
    console.log('PARSING READMES');
    const structures = readmes
      .map(parseReadme)
      .map(readme => {
        delete readme.contents;
        return readme;
      });

    console.log('DONE PARSING READMES');

    resolve(structures);
  });
