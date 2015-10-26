---
layout: component
title: Quandl
component: data/feed/quandl.js
namespace: data

example-code: |
  var feed = fc.data.feed.quandl()
    .database('WIKI')
    .dataset('AAPL')
    .rows(10)
    .descending(true)
    .collapse('weekly');

  // fetch some data!
  feed(function (error, data) {
    d3.select("#quandl")
      .text(JSON.stringify(error ? error : data, null, 2));
  });
---

This quandl component fetches data from the [Quandl API](https://www.quandl.com/docs/api#datasets). 
The `database`, `dataset` specify which dataset is retrieved, by default it will retrieve `YAHOO/GOOG`.

If you have an API key, this can be set using the `apiKey` property. 

The data returned can be limited either by date range using `start` and `end` (both must be provided as JavaScript `Date` instances) or by setting the maximum number of `rows` returned. By default, the data is returned in ascending order but this can be changed by setting `descending` to `true`.

The frequency of points can be controlled using the `collapse` property. Valid values for this are shown on the Quandl docs.

In order to shape the returned data, you can provide a function to `columnNameMap` which maps the column name to the required property name. If this returns `null` for a column, then it will be skipped. By default, the feed will lower case the first letter (i.e. map Close to close). This can be disabled by setting `columnNameMap` to `null`.
 
```js
{{{example-code}}}
```

<pre id="quandl">Loading...</pre>
<script type="text/javascript">
(function () {
    {{{example-code}}}
}());
</script>
