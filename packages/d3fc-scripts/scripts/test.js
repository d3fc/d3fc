const ESLint = require('eslint').CLIEngine;
const Jasmine = require('jasmine');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

// ====
// LINTER
// ====
const linter = new ESLint({
    configFile: path.join(__dirname, '..', '.eslintrc.json')
});
const linterReport = linter.executeOnFiles(['index.js', 'src/**/*.js', 'test/**/*.js', 'examples/**/*.js']);
if (linterReport.warningCount > 0 || linterReport.errorCount > 0) {
    console.log(linter.getFormatter()(linterReport.results));
    throw new Error('ESLint errors');
}

const required = (pathname) => path.resolve(__dirname, '../required', pathname || '');
const root = (pathname) => path.resolve(process.cwd(), pathname);

// ====
// REQUIRED FILES CHECK
// ====
const globOptions = {
    cwd: required(),
    dot: true
};

try {
    const files = glob.sync('*', globOptions);
    const results = files.map(filename => {
        try {
            const candidateContents = fs.readFileSync(root(filename));
            const requiredContents = fs.readFileSync(required(filename));

            if (!candidateContents.equals(requiredContents)) {
                console.log(filename, '\t\t', 'INCORRECT CONTENTS');
                return false;
            }
            console.log(filename, '\t\t', 'OK');
            return true;
        } catch (e) {
            console.log(filename, '\t\t', 'NO FILE');
            return false;
        }
    });

    const passed = results.every(r => r === true);
    const numberPassed = results.filter(r => r === true).length;
    console.log(`\n${numberPassed}/${files.length} required files OK\n`);

    if (!passed) {
        throw new Error('Required files are not correct - check https://github.com/d3fc/d3fc-scripts/required');
    }
} catch (err) {
    console.log('Required files check failed - ', err);
    process.exit(1);
}

// ====
// TESTS
// ====
require('./bundle')
  .then(() => {
      var jasmine = new Jasmine();
      jasmine.loadConfigFile(path.join(__dirname, '..', 'jasmine.json'));
      jasmine.execute();
      jasmine.onComplete(passed => {
          if (passed) {
              console.log('All tests passed');
          } else {
              console.error('At least one test failed');
          }
      });
  })
  .catch(e => {
      console.log(e);
      process.exit(1);
  });
