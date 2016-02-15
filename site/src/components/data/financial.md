---
layout: component
title: Random Financial
component: data/random/financial.js
namespace: Data
externals:
  financial-example-js: financial-example.js
  financial-example-html: financial-example.html
  financial-stream-example-js: financial-stream-example.js
  financial-stream-example-html: financial-stream-example.html
---

The random financial data generator component generates open-high-low-close-volume financial data.
Prices are calculated using the [random walk](./walk.html) component.
A `filter` can be supplied to exclude points from the output. 
Pre-defined filters can be used, for example to skip weekends use `fc.data.random.filter.skipWeekends`.

The following example:

```js
{{{ codeblock financial-example-js}}}
```

Generates the following:

{{{financial-example-html}}}
<script type="text/javascript">
{{{financial-example-js}}}
</script> 

{{{ dynamic-include 'codepen' html="financial-example-html" js="financial-example-js" }}}

## Stream
If you need to make successive calls to generate data while keeping track of the latest date and price, 
use the streaming interface.
You can see this in action in the [streaming chart example](../../examples/streaming/index.html).
First create a stream from an instance of `fc.data.random.financial` by calling the `stream` method.
Data points can then be generated using the stream's `next`, `take`, and `until` methods 
— the stream will use the latest date and price for subsequent calls.

An example using `next`, `take` and `until`:

```js
{{{ codeblock financial-stream-example-js}}}
```

{{{financial-stream-example-html}}}
<script type="text/javascript">
{{{financial-stream-example-js}}}
</script> 

{{{ dynamic-include 'codepen' html="financial-stream-example-html" js="financial-stream-example-js" }}}
