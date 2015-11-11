---
layout: example
title: Sampler
namespace: examples
script: index.js
---
<style>@import "index.css";</style>

<svg id="low-barrel">
  <g layout-style="flex: 0.65; flexDirection: row">
    <svg class="main" layout-style="flex: 1"></svg>
    <g layout-style="width: 20; justifyContent: center">
      <g layout-style="height: 0">
        <text text-anchor="middle" transform="rotate(90)">Temperature</text>
      </g>
    </g>
  </g>
  <g layout-style="flex: 0.15; flexDirection: row">
    <svg class="navigator" layout-style="flex: 1"></svg>
    <text layout-style="width: 20"></text>
  </g>
</svg>
<div class="controls">
  <div class="animations control">
    <input type="checkbox" checked id="animation-checkbox">
    <label for="animation-checkbox">Animations</label>
  </div>
  <div class="algorithms control">
    Sampling Algorithm:
    <input type="radio" checked id="three-bucket" name="algorithm">
    <label for="three-bucket">Largest Triangle Three Bucket</label>
    <input type="radio" id="mode-median" name="algorithm">
    <label for="mode-median">Mode Median</label>
  </div>
</div>

This example demonstrates how to sample a large data set, using the weather data from the [University of Edinburgh](http://www.ed.ac.uk/schools-departments/geosciences/weather-station/download-weather-data). The data set is over 150,000 data points, using temperatures recorded once an hour between 2006 and 2015.

Any 'juddering' or jitteriness that you see is caused by the moving of the data. As the visible data changes, the buckets and the data in each bucket will change, therefore the graph drawn could change too.

In terms of speed, every time the graph visible area changes, it recomputes the subsampled data points. This is why it appears to slow down when every data point is in the visible area.
