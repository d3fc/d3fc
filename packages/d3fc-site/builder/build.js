const handlebars = require('handlebars');
const marked = require('marked');
const matter = require('gray-matter');
const process = require('process');
const highlight = require('highlight.js');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdirp = require('mkdirp');
const globby = require('globby');

import fetchReadmes from './fetchReadmes';
import parseReadmes from './parseReadmes';
import filterReadmes from './filterReadmes';
import markdownSerialize from './markdownSerialize';
import copyReadmeAssets from './copyReadmeAssets';
import { readFile } from 'tiny-ssg/es5/util';

const resolveExternals = require('./resolveExternals');
const createComponentNavigation = require('./createComponentNavigation');

// let's just pretend we have destructuring or ES6 module imports ...
const globalSteps = require('tiny-ssg/es5/globalPipelineSteps');
const loadHandlebarsPartials = globalSteps.loadHandlebarsPartials;
const loadGlobalData = globalSteps.loadGlobalData;
const collectPagesFrontMatter = globalSteps.collectPagesFrontMatter;
const addGlobalData = globalSteps.addGlobalData;

const fileSteps = require('tiny-ssg/es5/filePipelineSteps');
const mergeGlobalData = fileSteps.mergeGlobalData;
const addPageMetadata = fileSteps.addPageMetadata;
const markCurrentPage = fileSteps.markCurrentPage;
const renderTemplate = fileSteps.renderTemplate;
const renderLayout = fileSteps.renderLayout;
const renderMarkdown = fileSteps.renderMarkdown;

// load the helpers required by the site build
require('handlebars-helpers').misc({ handlebars });
require('handlebars-helpers').comparison({ handlebars });

// load the project-specific helpers
require('./handlebars-helpers/dynamic-include').register(handlebars);
require('./handlebars-helpers/escape').register(handlebars);
require('./handlebars-helpers/codeblock').register(handlebars);
require('./handlebars-helpers/markdown').register(handlebars);
require('./handlebars-helpers/first').register(handlebars);
require('./handlebars-helpers/paramcase').register(handlebars);
require('./handlebars-helpers/json').register(handlebars);
require('./handlebars-helpers/hyperlink').register(handlebars);

export default async (config) => {
  // for dev builds don't syntax highlight
  if (!config.globalData.dev) {
    marked.setOptions({
      highlight: function (code) {
        return highlight.highlightAuto(code).value;
      }
    });
  }

  const workingDirectory = process.cwd();
  if (config.sourceFolder) {
    process.chdir(config.sourceFolder);
  }

  try {
    const chartStyle = fs.readFileSync('style/chart.css', 'utf8');

    let partial = await fetchReadmes();
    partial = await parseReadmes(partial);
    partial = await filterReadmes(partial);
    partial = await markdownSerialize(partial);
    partial = await loadHandlebarsPartials(config.includesPattern)(partial);
    partial = await loadGlobalData(config.globalPattern)(partial);
    partial = await collectPagesFrontMatter(config.filePattern)(partial);
    partial = await addGlobalData(config.globalData)(partial);

    const globalData = await addGlobalData({ 'chart-css': chartStyle })(partial);

    const filePaths = await globby(config.filePattern);
    for (const filePath of filePaths) {
      const file = await readFile(filePath);
      let partial = await matter(file);
      partial = await mergeGlobalData(globalData)(partial);
      partial = await addPageMetadata(filePath)(partial);
      partial = await markCurrentPage(partial);
      partial = await createComponentNavigation(partial);
      partial = await resolveExternals(partial);
      partial = await renderTemplate(partial);
      partial = await renderMarkdown(partial);
      partial = await renderLayout(partial);
      const destination = path.join(config.destinationFolder, partial.data.page.destination);
      await promisify(mkdirp)(path.dirname(destination));
      await promisify(fs.writeFile)(destination, partial.rendered, 'utf8');
      await copyReadmeAssets(partial);
    }
  } finally {
    process.chdir(workingDirectory);
  }
};
