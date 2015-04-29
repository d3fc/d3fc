---
layout: default
title: Sliding Window

example-code: |
    var data = [1, 5, 7, 3, 5, 7, 4, 2, 5, 6];
    var algorithm = fc.math.slidingWindow()
            .windowSize(5)
            .accumulator(d3.mean);

    var movingAverage = algorithm(data);


advanced-example: |
    // create an array of objects each with a value property
    var data = [1, 5, 7, 3, 5, 7, 4, 2, 5, 6]
        .map(function(d) { return { value: d }; });

    // create a moving average that reads from 'value' and writes to 'movinggAverage'
    var algorithm = fc.math.slidingWindow()
            .windowSize(5)
            .inputValue(function(obj) { return obj.value; })
            .outputValue(function(obj, value) { obj.movingAverage = value; })
            .accumulator(d3.mean);

    // the algorithm now mutates 'data'
    algorithm(data);
---

Sliding window is a component that applies an algorithm to a moving window of data across an array. It is a basic building block for many indicators including Moving Average, Moving Standard Deviation and composite indicators such as Bollinger Bands.

To use the sliding window algorithm you need to supply an accumulator function that is applied to each 'window'. The following simple example creates a 5-point moving average:

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

which yields the following output:

<pre id="math_slidingWindow"></pre>
<script type="text/javascript">
(function() {
    {{ page.example-code }}
    d3.select("#math_slidingWindow").html(movingAverage);
}());
</script>

You can supply functions that determine how the algorithm reads / writes values. This makes it easy to add the output of the sliding window calculation to an existing object:


{% highlight javascript %}
{{ page.advanced-example }}
{% endhighlight %}

With `data` being modified as follows:

<pre id="math_slidingWindow2"></pre>
<script type="text/javascript">
(function() {
    {{ page.advanced-example }}
    d3.select("#math_slidingWindow2").html(JSON.stringify(data));
}());
</script>
