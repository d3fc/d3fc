var marked = require('marked');
var highlight = require('highlight.js');

function register(handlebars) {
  handlebars.registerHelper('markdown', function(context, data) {
    return marked(data.fn(context));
  });
}

module.exports = {
  register: register
};
