---
layout: example
title: Yahoo Finance Chart
namespace: examples
---
<style>@import "index.css";</style>

<div style='margin-right: 40px;position:relative'>
  <div id="legend"></div>
  <svg id='time-series' style='height: 300px; width: 100%;  overflow: visible'>
    <defs>
      <linearGradient id="area-gradient"
                      x1="0%" y1="0%"
                      x2="0%" y2="100%">
         <stop offset="0%" stop-opacity="0.3" stop-color="#fff" />
        <stop offset="100%" stop-opacity="0" stop-color="#1a9af9" />
      </linearGradient>
      <g id="activeDay-1-1072d" transform="translate(-9.5-9.5)" stroke="#435862" fill="#000">
          <circle cx="9.5" cy="9.5" r="9.5" fill="#fff"/>
          <path d="M19 9.5c0 5.2-4.3 9.5-9.5 9.5S0 14.7 0 9.5 4.3 0 9.5 0 19 4.3 19 9.5zm-.9 0c0-.4-.3-.7-.7-.7H16c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h1.4c.3 0 .7-.3.7-.7zm-2.5-5c.3-.3.3-.7 0-1-.3-.3-.7-.3-1 0l-1 1c-.3.3-.3.7 0 1 .3.3.7.3 1 0l1-1zm-1.8 5c0-2.4-1.9-4.3-4.3-4.3S5.2 7.1 5.2 9.5s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3zm-3.6-6.4V1.7c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7v1.4c0 .4.3.7.7.7.4 0 .7-.3.7-.7zM5.5 5.5c.3-.3.3-.7 0-1l-1-1c-.3-.3-.7-.3-1 0s-.3.7 0 1l1 1c.2.2.7.2 1 0zM3.1 8.8H1.6c-.4 0-.7.3-.7.7 0 .4.3.7.7.7H3c.4 0 .7-.3.7-.7.1-.4-.2-.7-.6-.7zm.3 5.7c-.3.3-.3.7 0 1 .3.3.7.3 1 0l1-1c.3-.3.3-.7 0-1-.3-.3-.7-.3-1 0l-1 1zm5.4 1.4v1.4c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-1.4c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7zm4.7-2.4c-.3.3-.3.7 0 1l1 1c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-1-1c-.2-.2-.7-.2-1 0z"/>
      </g>
      <g id="postMarket-1-1072d" transform="translate(-9.5-9.5)" stroke="#435862" fill="#000">
          <circle cx="9.5" cy="9.5" r="9.5" fill="#fff" stroke="#000"/>
          <path d="M9.5 19c5.2 0 9.5-4.3 9.5-9.5S14.7 0 9.5 0 0 4.3 0 9.5 4.3 19 9.5 19zM7.9 1.7c.6-.2 1.3-.3 2-.3C14.4 1.4 18 5 18 9.5s-3.6 8.1-8.1 8.1c-.7 0-1.4-.1-2-.3 3.5-.9 6.1-4.1 6.1-7.8 0-3.8-2.6-6.9-6.1-7.8z" fill-rule="evenodd" clip-rule="evenodd"/>
      </g>
      <g id="preMarket-1-1072d" transform="translate(-9.5-9.5)" stroke="#435862" fill="#000">
          <circle cx="9.5" cy="9.5" r="9.5" fill="#fff"/>
          <path d="M19 9.5c0 5.2-4.3 9.5-9.5 9.5S0 14.7 0 9.5 4.3 0 9.5 0 19 4.3 19 9.5zM14.3 14.3l-3.1-3.7c.2-.3.4-.7.4-1.1 0-.9-.6-1.7-1.5-1.9V2.3c0-.3-.2-.5-.5-.5s-.6.3-.6.5v5.2c-.9.2-1.5 1-1.5 1.9 0 1.1.9 2 2 2 .3 0 .6-.1.9-.2l3.2 3.7c.1.1.2.2.4.2.1 0 .2 0 .3-.1.1-.2.2-.5 0-.7z"/>
      </g>
    </defs>
  </svg>
</div>
<script src="tradedHours.js"></script>
<script src="index.js"></script>

This example shows how d3fc components can be used to recreate the complex [Yahoo Finance Chart](http://finance.yahoo.com/echarts?s=yhoo+Interactive#{"showEma":true,"emaColors":"#cc0000","emaPeriods":"50","emaWidths":"1","emaGhosting":"0","range":"5d","allowChartStacking":true})

<p>This example makes use of a number of components, including the legend, crosshair, annotations and bands. It also includes a custom discontinuity provider for rendering an axis which excludes non-trading hours.</p>
<p>For a detailed overview of how this chart was implemented, pop over to the Scott Logic blog which covers the details via a two-part blog series (<a href="http://blog.scottlogic.com/2015/07/08/yahoo-finance-chart.html">part one</a>, <a href="http://blog.scottlogic.com/2015/07/22/yahoo-finance-chart-part-two.html">part two</a>).</p>
