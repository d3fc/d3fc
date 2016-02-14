---
layout: section
section: core
title: Date Time Scale
component: scale/dateTime.js
namespace: Scale
externals:
  datetime-example-js: dateTime-example.js
  datetime-example-html: dateTime-example.html
  datetime-example-2-js: dateTime-example-2.js
  datetime-example-2-html: dateTime-example-2.html

---

The dateTime scale component works in much the same way as the `d3.time.scale`, however, with the d3fc scale you can supply an optional discontinuity provider that allows you to add breaks, or discontinuities, within the scale:

Here's a simple example of the scale, without discontinuities:

```js
{{{ codeblock datetime-example-js }}}
```

The financial data being rendered doesn't have data-points for the weekends:

{{{ dynamic-include 'codepen' html="datetime-example-html" js="datetime-example-js" }}}

{{{datetime-example-html}}}
<script type="text/javascript">
{{{datetime-example-js}}}
</script>

By providing a discontinuity provider that skips weekends, `fc.scale.discontinuity.skipWeekends`, the gaps in the data are now closed:

```js
{{{ codeblock datetime-example-2-js }}}
```

{{{ dynamic-include 'codepen' html="datetime-example-2-html" js="datetime-example-2-js" }}}

{{{datetime-example-2-html}}}
<script type="text/javascript">
{{{datetime-example-2-js}}}
</script>

You can write your own discontinuity provider, by [implementing a simple interface of 5 methods]({{package.repository.url}}/tree/master/src/scale/discontinuity). For example, you could create a scale that only includes hours within the working day.
