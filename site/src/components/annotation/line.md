---
layout: component
title: Line
component: annotation/line.js
namespace: Annotation
externals:
  line-example-js: line-example.js
  line-example-html: line-example.html
---

The line annotation component renders horizontal or vertical line annotations. The following example takes a series, and plots its min, max and latest values as annotations:

```js
{{{ codeblock line-example-js}}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="line-example-html" js="line-example-js" }}}

{{{line-example-html}}}
<script type="text/javascript">
{{{line-example-js}}}
</script>

You can configure the value used to locate the annotation via the `value` property, the text that is rendered via the `label` property and create horizontal annotations by setting `orient('vertical')`. The annotations are also extensible via the `decorate` property, with 'container' elements being placed at either end for the easy addition of extra elements.
