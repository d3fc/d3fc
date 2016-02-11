---
layout: section
section: financial
title: Quandl
component: data/feed/quandl.js
namespace: Data
externals:
  quandl-example-js: quandl-example.js
  quandl-example-html: quandl-example.html
---

This quandl component fetches data from the [Quandl API](https://www.quandl.com/docs/api#datasets).
The `database`, `dataset` specify which dataset is retrieved, by default it will retrieve `YAHOO/GOOG`.

If you have an API key, this can be set using the `apiKey` property.

The data returned can be limited either by date range using `start` and `end` (both must be provided as JavaScript `Date` instances) or by setting the maximum number of `rows` returned. By default, the data is returned in ascending order but this can be changed by setting `descending` to `true`.

The frequency of points can be controlled using the `collapse` property. Valid values for this are shown on the Quandl docs.

In order to shape the returned data, you can provide a function to `columnNameMap` which maps the column name to the required property name. If this returns `null` for a column, then it will be skipped. By default, the feed will lower case the first letter (i.e. map Close to close). This can be disabled by setting `columnNameMap` to `null`.

```js
{{{ codeblock quandl-example-js}}}
```

{{{ dynamic-include 'codepen' html="quandl-example-html" js="quandl-example-js" }}}

{{{quandl-example-html}}}
<script type="text/javascript">
{{{quandl-example-js}}}
</script>
