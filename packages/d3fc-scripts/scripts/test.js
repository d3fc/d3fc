var ESLint = require('eslint').CLIEngine;
var Jasmine = require('jasmine');
var path = require('path');

var linter = new ESLint({
    configFile: path.join(__dirname, '..', '.eslintrc.json')
});
var linterReport = linter.executeOnFiles(['index.js', 'src/**/*.js', 'test/**/*.js']);
if (linterReport.warningCount > 0 || linterReport.errorCount > 0) {
    console.log(linter.getFormatter()(linterReport.results));
    throw new Error('ESLint errors');
}

require('./bundle')
  .then(() => {
      var jasmine = new Jasmine();
      jasmine.loadConfigFile(path.join(__dirname, '..', 'jasmine.json'));
      jasmine.execute();
  })
  .catch(e => {
      console.log(e);
      process.exit(1);
  });
