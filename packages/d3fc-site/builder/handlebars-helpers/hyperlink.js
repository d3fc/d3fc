
function register(handlebars) {
  handlebars.registerHelper('hyperlink', function(link, context) {
    var linkComponents = link.split('#');
    var linkBeforeFragment = linkComponents.length > 1 ? linkComponents[0] : link;
    var linkFragment = linkComponents.length > 1 ? linkComponents[1] : undefined;

    var pages = context.data.root.pages;
    var matches = pages.filter(function(pageMetadata) {
      return pageMetadata.page.destination.endsWith('/' + linkBeforeFragment);
    });

    if (!context.hash.title) {
      throw new Error('A title was not provided for the hyperlink within page ' + context.data.root.page.path);
    }

    if (matches.length === 1) {
      var title = context.hash.title;
      return '<a href="' + matches[0].page.destination + (linkFragment ? '#' + linkFragment : '') + '">' + title + '</a>';
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
