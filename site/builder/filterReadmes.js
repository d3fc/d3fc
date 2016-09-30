function filterBlock(block, filters) {
  const filteredChildren = [];

  // Remove blocks which are present in the filters.sections array
  if (block.children) {
    for (let child of block.children) {
      if (!filters.sections.includes(child.title.toLowerCase())) {
        filteredChildren.push(filterBlock(child, filters));
      }
    }
  }

  // Find & replace from content property using regexes from filters.regex
  block.content = block.content.replace(
    new RegExp(`(${filters.regex.join('|')})`, 'g'),
    ''
  );

  if (filteredChildren.length) {
    block.children = filteredChildren;
  }
  return block;
}

function filterReadme(structure, filters) {
  return filterBlock({
    title: '',
    content: '',
    children: structure,
    level: 0
  }, filters).children;
}

export default (readmes) =>
  new Promise((resolve, reject) => {
    const filters = {
      sections: ['installing'],
      regex: ['\\[Main d3fc package\\]\\(.+?\\)[\\n\\r]+']
    };

    console.log('FILTERING READMES');
    readmes.forEach(readme => {
      readme.structure = filterReadme(readme.structure, filters);
    });
    console.log('DONE FILTERING READMES');

    resolve(readmes);
  });
