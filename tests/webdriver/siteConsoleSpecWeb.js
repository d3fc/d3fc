describe('Visit all pages, check for no console errors', function () {

    it('iterate through the documentation', function (done) {

        var urls = [];

        function testNextPage() {
            if (urls.length == 0) {
                browser.call(done);
                return;
            }
            browser.url(urls.pop()).getTitle()
                .then(function (err, res) {
                    testNextPage();
                })
        }

        return browser
            .url('/components/introduction/1-getting-started.html')
            .getAttribute('.nav-stacked a', 'href').then(function (attr) {
                urls = attr; //iterate over it using the thing im in
                return testNextPage();
            });
    });
});