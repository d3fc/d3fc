var marked = require('marked');

function register(handlebars) {
  handlebars.registerHelper('markdown', function(context, data) {
    return marked(data.fn(context));
  });
}

module.exports = {
  register: register
};
