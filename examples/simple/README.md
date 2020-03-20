---
title: "Line / Area Chart"
section: "Non-Block Examples"
---

This example demonstrates how to render a simple Cartesian chart with a line and an area series. The chart is constructed from the following components:

 + A [Cartesian chart](/api/chart-api), with linear scales for x and y, is used to render the plot area, axes and labels.
 + The data is rendered via a [line series](/api/series-api#line) and an [area series](/api/series-api#area), these are combined into a single series using the [multi series](/api/series-api#multi) component.
 + A [gridlines component](/api/annotation-api#gridline) is also added to the multi series.
 + The [extent](/api/extent-api) utility function is used to calculate the domain for the x and y scale, with padding applied to the y scale.
