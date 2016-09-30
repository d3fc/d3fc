var Q = require('q');
var util = require('tiny-ssg/es5/util');

function resolveExternals(postMatter) {
  var externals = postMatter.data.externals || [];

  var resolve = Object.keys(externals)
      .map(function(key) {
        var file = postMatter.data.page.dirname + '/' + externals[key];
        return util.readFile(file)
            .then(function(fileData) { postMatter.data[key] = fileData; });
      });

  return Q.all(resolve)
        .then(function() { return postMatter; });
}

module.exports = resolveExternals;
