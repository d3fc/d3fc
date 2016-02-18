var tinySSG = require('tiny-ssg');
var handlebars = require('handlebars');
var marked = require('marked');
var matter = require('gray-matter');
var process = require('process');
var highlight = require('highlight.js');
var fs = require('fs');

var resolveExternals = require('./resolveExternals');
var createComponentNavigation = require('./createComponentNavigation');

// let's just pretend we have destructuring or ES6 module imports ...
var globalSteps = require('tiny-ssg/es5/globalPipelineSteps');
var loadHandlebarsPartials = globalSteps.loadHandlebarsPartials;
var loadGlobalData = globalSteps.loadGlobalData;
var collectPagesFrontMatter = globalSteps.collectPagesFrontMatter;
var addGlobalData = globalSteps.addGlobalData;

var fileSteps = require('tiny-ssg/es5/filePipelineSteps');
var mergeGlobalData = fileSteps.mergeGlobalData;
var addPageMetadata = fileSteps.addPageMetadata;
var markCurrentPage = fileSteps.markCurrentPage;
var renderTemplate = fileSteps.renderTemplate;
var renderLayout = fileSteps.renderLayout;
var renderMarkdown = fileSteps.renderMarkdown;
var writePost = fileSteps.writePost;

var util = require('tiny-ssg/es5/util');
var chainPromises = util.chainPromises;
var mapFiles = util.mapFiles;

// load the helpers required by the site build
require('handlebars-helpers/lib/helpers/helpers-miscellaneous').register(handlebars);
require('handlebars-helpers/lib/helpers/helpers-comparisons').register(handlebars);

// load the project-specific helpers
require('./handlebars-helpers/dynamic-include').register(handlebars);
require('./handlebars-helpers/escape').register(handlebars);
require('./handlebars-helpers/codeblock').register(handlebars);
require('./handlebars-helpers/json').register(handlebars);
require('./handlebars-helpers/hyperlink').register(handlebars);

function build(config) {
    // for dev builds don't syntax highlight
    if (!config.globalData.dev) {
        marked.setOptions({
            highlight: function(code) {
                return highlight.highlightAuto(code).value;
            }
        });
    }

    var workingDirectory = process.cwd();
    if (config.sourceFolder) {
        process.chdir(config.sourceFolder);
    }

    var chartStyle = fs.readFileSync('style/chart.css', 'utf8');

    return chainPromises({}, [
        loadHandlebarsPartials(config.includesPattern),
        loadGlobalData(config.globalPattern),
        collectPagesFrontMatter(config.filePattern),
        addGlobalData(config.globalData),
        addGlobalData({'chart-css': chartStyle})
    ])
    .then(function(globalData) {
        return mapFiles(config.filePattern, function(file, filePath) {
            return chainPromises(matter(file), [
                mergeGlobalData(globalData),
                addPageMetadata(filePath),
                markCurrentPage,
                createComponentNavigation,
                resolveExternals,
                renderTemplate,
                renderMarkdown,
                renderLayout,
                writePost(config.destinationFolder)
            ]);
        });
    })
    .then(function() {
        process.chdir(workingDirectory);
    })
    .catch(function(e) {
        process.chdir(workingDirectory);
        throw e;
    });
}

module.exports = build;
