---
layout: default
title: Data Generator
---

This component will generate some 'fake' daily price data to use when developing charts using these components. The generator uses the [Geometric Brownian motion](http://en.wikipedia.org/wiki/Geometric_Brownian_motion) model to generate price data points and a standard randomisation to generate volume values. This component has no SVG output, nor creates any DOM elements.

<table class="table table-striped table-condensed">
<thead>
</thead>
<tbody>
</tbody>
</table>

#### JavaScript

{% highlight javascript %}
var dataSeries_Small = fc.utilities.dataGenerator()
  .mu(0.1)
  .sigma(0.2)
  .fromDate(new Date(2014, 1, 1))
  .toDate(new Date(2014, 2, 1))
  .generate();
{% endhighlight %}

<script type="text/javascript">
(function(){
	// Create the table header
	var thead = d3.select("thead")
	  .selectAll("th")
	  .data(d3.keys(dataSeries_Small[0]))
	  .enter()
	  .append("th")
	  .text(function(d) { return d; } );

	// Fill the table
	// Create rows
	var rows = d3.select("tbody")
	  .selectAll("tr")
	  .data(dataSeries_Small)
	  .enter()
	  .append("tr")

	// cells
	var cells = rows
	  .selectAll("td")
	  .data(function(d) { return d3.values(d); } )
	  .enter()
	  .append("td")
	  .text(function(d) { return typeof d == 'object' ? d.toDateString() : d3.format('.2f')(d); });
}());
</script>
