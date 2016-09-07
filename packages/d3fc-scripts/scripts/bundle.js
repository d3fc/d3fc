var babel = require('rollup-plugin-babel');
var fs = require('fs');
var globals = require('./util/globals');
var mkdirp = require('mkdirp');
var packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var rimraf = require('rimraf');
var rollup = require('rollup');
var uglifyJS = require('uglify-js');

rimraf.sync('build');

mkdirp.sync('build');

module.exports = rollup.rollup({
    entry: 'index.js',
    plugins: [
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ]
})
  .then(bundle =>
      bundle.write({
          dest: `build/${packageJson.name}.js`,
          format: 'umd',
          globals: globals(packageJson),
          moduleName: 'fc'
      })
  )
  .then(() => {
      var result = uglifyJS.minify([`build/${packageJson.name}.js`]);
      fs.writeFileSync(`build/${packageJson.name}.min.js`, result.code);
  })
  .catch(e => {
      console.log(e);
      process.exit(1);
  });
