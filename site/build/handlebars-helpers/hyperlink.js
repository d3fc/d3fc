
function register(handlebars) {
    handlebars.registerHelper('hyperlink', function(link, context) {
        var pages = context.data.root.pages;
        var matches = pages.filter(function(pageMetadata) {
            return pageMetadata.page.destination.endsWith('/' + link);
        });
        if (matches.length === 1) {
            var title = context.hash.title;
            return '<a href=\"' + matches[0].page.destination + '\">' + title + '</a>';
        } else {
            throw new Error('Unable to locate link ' + link + ' within page ' + context.data.root.page.path);
        }
    });
}

module.exports = {
    register: register
};
