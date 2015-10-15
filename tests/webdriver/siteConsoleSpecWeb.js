describe('Visit all pages, check for no console errors', function () {

    it('site pages contains no logs / errors', function (done) {

        var urls = [];

        function testNextPage() {
            if (urls.length == 0) {
                browser.call(done);
                return;
            }
            var url = urls.pop();
            browser.url(url)
                .then(function (err, res) {
                    browser.log('browser').then(function (f) {
                        var errors = [];
                        while(f.value.length > 0){
                            var err = f.value.pop();
                            //Excluding liverload errors
                            if(err.message.indexOf(":35729/livereload.js") <= -1 ){
                                errors.push(err);
                            }
                        }
                        expect(errors.length).toEqual(0, 'Errors/console logs in the url: '+url);
                        testNextPage();
                    });

                });
        }

        return browser
            .url('/components/introduction/1-getting-started.html')
            .getAttribute('.nav-stacked a', 'href').then(function (attr) {
                urls = attr; //iterate over it using the thing im in
                return testNextPage();
            });
    });
});
