const commandLineArgs = require('command-line-args');
const markdownlint = require("markdownlint");
const glob = require("glob");
const path = require("path");

const root = path.resolve(__dirname, '../../..');
const optionDefinitions = [
    { name: 'src', type: String, defaultOption: true, defaultValue: ['**.md'] },
    { name: 'verbose', type: Boolean, alias: 'v', defaultOption: false, defaultValue: false }
];
const params = commandLineArgs(optionDefinitions);
const options = { ignore: ['node_modules/**'], cwd: root };

const getAllFiles = globs => {
    let files = [];
    globs.map(entry => {
        if(entry.indexOf('.md') < 0) {
            throw 'ERROR: targetting non .md files';
        }
        files = files.concat( glob.sync(entry, options));
    });
    if(params.verbose) {
        console.log('files', files);
        console.log('root', root);
    }
    return files;
}

markdownlint( { "files": getAllFiles(params.src) }, (err, result) => {
    if(err) {
        throw err;
    }
    console.log(result.toString());
});
