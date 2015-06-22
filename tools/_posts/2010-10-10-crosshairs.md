---
layout: default
title: Crosshairs
component: tool/crosshair.js

example-code: |
  // create a line series and a crosshair
  var line = fc.series.line();
  var crosshair = fc.tool.crosshair();

  // create an array which will hold the crosshair datapoint
  var crosshairData = [];

  // use a multi-series to render both the line and crosshair
  var multi = fc.series.multi()
    .series([line, crosshair])
    .xScale(xScale)
    .yScale(yScale)
    .mapping(function(series) {
        switch (series) {
            case line:
                return data;
            case crosshair:
                return crosshairData;
        }
    });

  container.append('g')
      .datum(data)
      .call(multi);
---

The crosshair component renders an interactive crosshair. The component should be data-joined to an empty array which it will populate with an object that indicates the current crosshair location. This is a useful mechanism for displaying the crosshair location in some form of legend.

The crosshair is typically rendered alongside other series. The following example uses a multi-series component to render a crosshair and a line series:

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

Which gives the following:

{% include exampleFixture.html %}

You can control the snapping behaviour of the crosshair by supplying a snapping function to the `snap` property. A number of snap functions are [supplied as part of the library]({{ site.project-repo-url }}/blob/master/src/util/snap.js).

You can configure X and Y labels via the `xLabel` and `yLabel` properties. The following example formats the Y value to 2 decimal places:

{% highlight javascript %}
var crosshairs = fc.tool.crosshair()
  .yLabel(function(d) { return d3.format('.2f')(d.datum.close); });
{% endhighlight %}

The crosshair emits 'trackingstart', 'trackingmove' and 'trackingend' events which can be used to add further interactively. You can also modify the crosshair UI via the `decorate` property.


