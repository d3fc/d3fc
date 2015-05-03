---
layout: default
title: Bollinger Bands
component: indicators/algorithms/bollingerBands.js

example-code: |
    var data = [1, 5, 7, 3, 5, 7, 4, 2, 5, 6];
    var algorithm = fc.indicators.algorithms.bollingerBands()
            .windowSize(5);

    var bollinger = algorithm(data);

---
[Bollinger bands](http://en.wikipedia.org/wiki/Bollinger_Bands) are an indicator that combine an n-point moving average with upper and lower bands that are positioned k-times an n-point standard deviation around the average.


{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

which yields the following output:

<pre id="math_bollinger"></pre>
<script type="text/javascript">
(function() {
    {{ page.example-code }}

    d3.select("#math_bollinger").html(JSON.stringify(bollinger));
}());
</script>

The bollinger bands component exposes a `windowSize` property which can be used to modify the period of the bollinger bands and a `multiplier` which is applied to the standard deviation. It also exposes the same `inputValue` and `outputValue` properties as the slidingWindow component.