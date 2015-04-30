---
layout: default
title: Relative Strength Indicator
component: math/relativeStrengthIndex.js

example-code: |
    // create some test data
    var data = fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1))(30);

    var algorithm = fc.math.relativeStrengthIndicator();

    var rsi = algorithm(data);

---

A [Relative Strength Indicator](http://en.wikipedia.org/wiki/Relative_strength_index) is an indicator that plots the historical strength or weakness of a stock based on opening and closing prices. 

You can compute the RSI for an array of data as follows:

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

Which yields the following output:

<pre id="math_rsi"></pre>
<script type="text/javascript">
(function() {
    {{ page.example-code }}
    d3.select("#math_rsi").html(JSON.stringify(rsi));
}());
</script>

You can configure how the open and close prices are extracted from each object in the array via the `openValue` and `closeValue` properties, and the period of the RSI via the `windowSize` property.

