---
title: "Stacked Bar"
section: "Non-Block Examples"
---

This example demonstrates a stacked bar chart using energy production data from [eurostat](http://ec.europa.eu/eurostat/statistics-explained/index.php). The chart is constructed from the following components:

 - A [Cartesian chart](/api/chart-api), with an ordinal y axis and a linear x axis.
 - The data is prepared using the [group component](/api/group-api), which creates a two dimensional array of data, followed by a D3 stack layout, which stacks the 'y' values.
 - The data is rendered via a horizontally oriented [stacked bar series](/api/series-api).
 - The decorate pattern is also used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project).
