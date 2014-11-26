---
layout: default
title: Candlestick
javascript: |
  // create a candlestick series, associating it with a pair of axes
  var candlestick = fc.series.candlestick()
                  .xScale(x)
                  .yScale(y)
                  .rectangleWidth(5);

  // add it to the plot area
  plotArea.append('g')
          .attr('class', 'series')
          .datum(data)
          .call(candlestick);
css: |
  ???
html: |
  <g class="candlestick-series">
      <g class="bar down-day">
          <path class="high-low-line"></path>
          <rect></rect>
      </g>
      <g class="bar up-day">
          <path class="high-low-line"></path>
          <rect></rect>
      </g>
  </g>
---

This component calculates and draws a candlestick data series, the series shows high, low, open and close values on the Y axis against Date/Time on the X axis. The series can be styled using CSS to represent market gains or market losses.

<div id="volumeExample"> </div>

{% include tabs.html %}
