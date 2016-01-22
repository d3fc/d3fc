
describe('Visit all pages, check for no console errors', function() {

    function testPagesForConsoleOutput(urls, done) {
        if (urls.length === 0) {
            browser.call(done);
            return;
        }
        var url = urls.pop();
        browser.url(url)
            .then(function(x, res) {
                browser.log('browser')
                    .then(function(result) {
                        result.value.filter(function(e) {
                            return e.message.indexOf('livereload') === -1 //Excluding liverload errors
                                && e.message.indexOf('https://www.quandl.com/api/v3/') === -1; // Excluding Quandl API Issues (limited number of requests per day)
                        }).forEach(function(e) {
                            expect(e).toBeUndefined('Errors/console logs in the url: ' + url);
                        });
                        testPagesForConsoleOutput(urls, done);
                    });
            });
    }

    function getLinks(baseUrl, cssSelector) {
        return browser.url(baseUrl)
            .getAttribute(cssSelector, 'href');
    }

    it('site documentation contains no logs / errors', function(done) {
        return getLinks('http://localhost:8000/components/introduction/1-getting-started.html', '.nav-stacked a')
            .then(function(links) {
                return testPagesForConsoleOutput(links, done);
            });
    });

    it('site examples contains no logs / errors', function(done) {
        return getLinks('http://localhost:8000/examples', '.nav-stacked a')
            .then(function(links) {
                links.push('http://localhost:8000/examples');
                return testPagesForConsoleOutput(links, done);
            });
    });

    it('site main page contains no logs / errors', function(done) {
        var links = ['http://localhost:8000/'];
        return testPagesForConsoleOutput(links, done);
    });
});
