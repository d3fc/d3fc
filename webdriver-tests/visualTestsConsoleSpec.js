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
                                && e.message.indexOf('https://www.quandl.com/api/v3/') === -1 // Excluding Quandl API Issues (limited number of requests per day)
                                && e.message.indexOf('fc.util.extent is deprecated') === -1 // Exclude fc.util.extent deprecation warnings
                                && e.message.indexOf('favicon.ico') === -1;
                        }).forEach(function(e) {
                            expect(e).toBeUndefined('Errors/console logs in the url: ' + url);
                        });
                        testPagesForConsoleOutput(urls, done);
                    });
            });
    }

    it('visual tests contains no logs / errors', function(done) {
        var links = ['http://localhost:9000/'];
        return testPagesForConsoleOutput(links, done);
    });
});
