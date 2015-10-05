---
layout: example
title: Low Barrel
namespace: examples
---
<style>@import "index.css";</style>

<table id="low-barrel" class="chart">
  <tr class="main-row">
    <td>
      <svg class="main"></svg>
    </td>
    <td>
      <span>OHLC</span>
    </td>
  </tr>
  <tr class="volume-row">
    <td>
      <svg class="volume"></svg>
    </td>
    <td>
      <span>Volume</span>
    </td>
  </tr>
  <tr class="navigator-row">
    <td>
      <svg class="navigator"></svg>
    </td>
    <td></td>
  </tr>
</table>


This example shows how a more complex chart can be built using the d3fc components.

The three charts that make up this example are each [linear time series](../../components/chart/linearTimeSeries.html) charts. The top-most chart uses the [gridlines](../../components/annotation/gridlines.html), [crosshairs](../../components/tool/crosshairs.html) and [candlestick](../../components/series/candlestick.html) components, rendered via the [multi-series](../../components/series/multi.html) component. The volume and navigator charts uses a similar mix of components.

These charts all share the same underlying data, however, this is enhanced with the data that represents the current interactive state.

The top-most chart uses a tooltip component that was written specifically for this example application. It is added as a 'decoration' of the crosshair.

<script src="index.js"></script>
