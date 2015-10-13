---
layout: example
title: Low Barrel
namespace: examples
script: index.js
---
<style>@import "index.css";</style>

<svg id="low-barrel">
  <g layout-css="flex: 0.65; flexDirection: row">
    <svg class="main" layout-css="flex: 1"></svg>
    <g layout-css="width: 20; justifyContent: center">
      <g layout-css="height: 0">
        <text text-anchor="middle" transform="rotate(90)">OHLC</text>
      </g>
    </g>
  </g>
  <g layout-css="flex: 0.2; flexDirection: row">
    <svg class="volume" layout-css="flex: 1"></svg>
    <g layout-css="width: 20; justifyContent: center">
      <g layout-css="height: 0">
        <text text-anchor="middle" transform="rotate(90)">Volume</text>
      </g>
    </g>
  </g>
  <g layout-css="flex: 0.15; flexDirection: row">
    <svg class="navigator" layout-css="flex: 1"></svg>
    <text layout-css="width: 20"></text>
  </g>
</svg>

This example shows how a more complex chart can be built using the d3fc components.

The three charts that make up this example are each [linear time series](../../components/chart/linearTimeSeries.html) charts. The top-most chart uses the [gridlines](../../components/annotation/gridlines.html), [crosshairs](../../components/tool/crosshairs.html) and [candlestick](../../components/series/candlestick.html) components, rendered via the [multi-series](../../components/series/multi.html) component. The volume and navigator charts uses a similar mix of components.

These charts all share the same underlying data, however, this is enhanced with the data that represents the current interactive state.

The top-most chart uses a tooltip component that was written specifically for this example application. It is added as a 'decoration' of the crosshair.
