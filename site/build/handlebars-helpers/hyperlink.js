var url = require('url');

function register(handlebars) {
    handlebars.registerHelper('hyperlink', function(link, context) {
        var pages = context.data.root.pages;

        var matches = pages.map(function(pageMetadata) {
            // Ensures Windows file paths (e.g. "\\examples\\simple\\index.html")
            // are formatted to URL strings (e.g "/examples/simple/index.html")
            return url.parse(pageMetadata.page.destination).href;
        }).filter(function(destination) {
            return destination.endsWith('/' + link);
        });

        if (!context.hash.title) {
            throw new Error('A title was not provided for the hyperlink within page ' + context.data.root.page.path);
        }

        if (matches.length === 1) {
            var title = context.hash.title;
            return '<a href=\"' + matches[0] + '\">' + title + '</a>';
        } else {
            if (matches.length === 0) {
                throw new Error('Unable to locate a page with the name ' + link + ' hyperlinked within page ' + context.data.root.page.path);
            }
            if (matches.length > 1) {
                throw new Error('Multiple pages end with the name ' + link +
                    ', expand the path in order to make the link un-ambiguous, hyperlinked within page ' + context.data.root.page.path);
            }
        }
    });
}

module.exports = {
    register: register
};
