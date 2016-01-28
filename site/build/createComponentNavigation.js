function groupBy(array, key) {
    return array.reduce(function(grouped, item) {
        var index = grouped.findIndex(function(i) { return key(i) === key(item); });
        if (index !== -1) {
            grouped[index].items.push(item);
        } else {
            grouped.push({
                namespace: key(item),
                items: [item]
            });
        }
        return grouped;
    }, []);
}

function sortOrder(order, accessor) {
    order = order.reverse();
    return function(a, b) {
        return order.indexOf(accessor(b)) - order.indexOf(accessor(a));
    };
}

function createComponentNavigation(postMatter) {

    var namespaceOrder = ['Introduction', 'Chart', 'Series'];
    var introductionOrder = ['Getting Started', 'Building A Chart', 'Transitions', 'Decorate Pattern', 'Component Design'];

    if (postMatter.data.layout === 'component') {
        // create a grouped structure for component navigation
        var componentPages = postMatter.data.pages.filter(function(page) { return page.layout === 'component'; });
        var groupedPages = groupBy(componentPages, function(item) { return item.namespace; });
        // sort the namespaces
        groupedPages.sort(sortOrder(namespaceOrder, function(item) { return item.namespace; }));
        // sort the introduction section
        var introductionGroup = groupedPages.find(function(item) { return item.namespace === 'Introduction';});
        introductionGroup.items.sort(sortOrder(introductionOrder, function(item) { return item.title; }));

        postMatter.data.groupedPages = groupedPages;

        // flatten for mobile menu
        var flattenedMenu = [].concat.apply([], groupedPages.map(function(i) { return i.items; }));
        var currentPageIndex = flattenedMenu.findIndex(function(page) { return page.isCurrentPage; });
        if (currentPageIndex > 0) {
            postMatter.data.previousPage = flattenedMenu[currentPageIndex - 1];
        }
        if (currentPageIndex < componentPages.length) {
            postMatter.data.nextPage = flattenedMenu[currentPageIndex + 1];
        }
    }
    return postMatter;
}

module.exports = createComponentNavigation;
