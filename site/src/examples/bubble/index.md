---
layout: example
title: Bubble Chart
example: true
externals:
  bubble-js: bubble.js
  bubble-html: bubble.html
  bubble-css: bubble.css
---

<style>
{{{bubble-css}}}
</style>

{{{ dynamic-include 'codepen' html='bubble-html' js='bubble-js' css='bubble-css'}}}
{{{ bubble-html }}}
{{{ dynamic-include 'javascript' js='bubble-js' }}}

This example demonstrates how to a bubble Cartesian chart with a line and an area series. The chart is constructed from the following components:

This example demonstrates how to render a bubble chart with data that shows the relationship between life expectancy and wealth, obtained via  [Gapminder](http://www.gapminder.org/world/#$majorMode=chart$is;shi=t;ly=2003;lb=f;il=t;fs=11;al=30;stl=t;st=t;nsl=t;se=t$wst;tts=C$ts;sp=5.59290322580644;ti=2013$zpv;v=0$inc_x;mmid=XCOORDS;iid=phAwcNAVuyj1jiMAkmq1iMg;by=ind$inc_y;mmid=YCOORDS;iid=phAwcNAVuyj2tPLxKvvnNPA;by=ind$inc_s;uniValue=8.21;iid=phAwcNAVuyj0XOoBL_n5tAQ;by=ind$inc_c;uniValue=255;gid=CATID0;by=grp$map_x;scale=log;dataMin=194;dataMax=96846$map_y;scale=lin;dataMin=23;dataMax=86$map_s;sma=49;smi=2.65$cd;bd=0$inds=;modified=60). The chart is constructed from the following components:

+ The `d3.json` component is used to load the data from a JSON file.
+ A {{{ hyperlink 'chart-api.html' title='Cartesian chart' }}}, with a logarithmic x scale and linear y scale, is used to render the plot area, axes and labels.
+ A {{{ hyperlink 'series-api.html#point' title='point series' }}} is used to render the data, with the `size` of each point defined via another linear scale.
+ The {{{ hyperlink 'decorate-pattern.html' title='decorate pattern' }}} is used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project).



```js
{{{ codeblock bubble-js }}}
```
