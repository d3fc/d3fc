var matter = require('gray-matter');
var extend = require('node.extend');

// allows a template to be included where the data supplied to the template is specified
// at the point of template invocation (rather than just inheriting the current data context)
function register(handlebars) {
    handlebars.registerHelper('dynamic-include', function(templateName, context) {
        var templateFile = '_includes/' + templateName + '.hbs';
        var templateMatter = matter.read(templateFile);
        var compiledTemplate = handlebars.compile(templateMatter.content);
        var data = extend({}, context.data.root);
        Object.keys(context.hash)
            .forEach(function(key) {
                if (context.data.root[context.hash[key]]) {
                    data[key] = context.data.root[context.hash[key]];
                }
            });
        return compiledTemplate(data);
    });
}

module.exports = {
    register: register
};
