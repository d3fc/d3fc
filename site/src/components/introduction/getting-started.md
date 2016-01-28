---
layout: component
namespace: Introduction
title: Getting Started
externals:
  getting-started-js: getting-started.js
  getting-started-html: getting-started.html
---

## Grabbing the code

d3fc and its dependencies are available via npm or cdnjs.

### Installing with npm

You can install d3fc and its dependencies via npm as follows:

```
npm install d3fc
```

Once installed, you can reference the d3fc JavaScript, CSS and dependencies within an HTML page as follows:

```html
<script src="node_modules/d3fc/node_modules/d3/d3.js"></script>
<script src="node_modules/d3fc/node_modules/css-layout/dist/css-layout.js"></script>
<script src="node_modules/d3fc/node_modules/d3-svg-legend/d3-legend.js"></script>
<script src="node_modules/d3fc/node_modules/svg-innerhtml/svg-innerhtml.js"></script>
<script src="node_modules/d3fc/dist/d3fc.js"></script>

<link href="node_modules/d3fc/dist/d3fc.css" rel="stylesheet"/>
```

### Using cdnjs

Alternatively you can link to d3fc and its dependencies directly via cdnjs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3fc/{{ package.version }}/d3fc.bundle.min.js"></script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/d3fc/{{ package.version }}/d3fc.min.css" rel="stylesheet"/>
```

## A quick chart

If you want a quick verification that everything has installed correctly, the following code will render a cartesian chart:

```html
{{{ getting-started-html }}}
```

```js
{{{ getting-started-js }}}
```

Here is how the chart should look:

{{{ dynamic-include 'codepen' html="getting-started-html" js="getting-started-js" }}}

{{{getting-started-html}}}
<script type="text/javascript">
{{{getting-started-js}}}
</script>

The next step is to follow the more in-depth tutorial on [building a chart](/components/introduction/building-a-chart.html).
