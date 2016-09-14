var babel = require('rollup-plugin-babel');
var fs = require('fs');
var mkdirp = require('mkdirp');
var packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var rimraf = require('rimraf');
var rollup = require('rollup');
var uglifyJS = require('uglify-js');
var nodeResolve = require('rollup-plugin-node-resolve');
var commandLineArgs = require('command-line-args');

rimraf.sync('build');

mkdirp.sync('build');

var optionDefinitions = [
  { name: 'include-d3fc', type: Boolean, defaultOption: false }
];
var options = commandLineArgs(optionDefinitions);

var external = function(key) {
    return (key.indexOf('d3-') === 0) ||
      (!options['include-d3fc'] && key.indexOf('d3fc-') === 0);
};
var globals = function(key) {
    if (key.indexOf('d3-') === 0) {
        return 'd3';
    }
    if (key.indexOf('d3fc-') === 0) {
        return 'fc';
    }
};

module.exports = rollup.rollup({
    entry: 'index.js',
    plugins: [
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        nodeResolve({ jsnext: true, main: true })
    ],
    external: external
})
  .then(bundle =>
      bundle.write({
          dest: `build/${packageJson.name}.js`,
          format: 'umd',
          globals: globals,
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
