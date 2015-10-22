describe('Visit all pages, check for no console errors', function() {

    it('site pages contains no logs / errors', function(done) {

        var urls = [];

        function testNextPage() {
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

                            testNextPage();
                        });
                });
        }

        return browser.url('/components/introduction/1-getting-started.html')
            .getAttribute('.nav-stacked a', 'href')
            .then(function(attr) {
                urls = attr; //iterate over it using the thing im in
                return testNextPage();
            });
    });
});
