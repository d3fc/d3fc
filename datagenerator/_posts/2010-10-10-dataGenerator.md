---
layout: default
title: Data Generator
component: dataGenerator/dataGenerator.js

example-code: |
  // construct a data generator
  dataGenerator = fc.dataGenerator();

  // generate some data!
  var data = dataGenerator(10);
---

The data generator component is a useful testing utility that generates data via a random walk algorithm.

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

<pre id="utilities_generator"></pre>
<script type="text/javascript">
(function() {
    {{ page.example-code }}
    d3.select("#utilities_generator").html(JSON.stringify(data));
}());
</script>

You can supply a `filter` to skips days (i.e. weekends), and change the start price, volume and date. 