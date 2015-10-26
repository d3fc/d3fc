---
layout: component
title: Flexbox Layout
component: layout/layout.js
namespace: layout

example-html: |
  <svg id="layout-test"
     style="width: 90%; height: 350px; margin: 10px; background: yellow"
     layout-style="paddingLeft: 10">
    <g layout-style="height: 30; justifyContent: center; flexDirection: row;">
    </g>
    <g layout-style="flex: 1; flexDirection: row;">
      <g layout-style="flex: 1; flexDirection: row; justifyContent: flex-end;">
        <g layout-style="width: 100; height: 100; margin: 10"></g>
      </g>
      <g layout-style="width: 50;"></g>
      <g layout-style="width: 30; justifyContent: center;"></g>
    </g>
    <g layout-style="height: 30; flexDirection: row">
      <g layout-style="flex: 1; marginRight: 80;"></g>
    </g>
    <g layout-style="height: 30; flexDirection: row"></g>
  </svg>

example-code: |
  // apply the flexbox layout
  d3.select('#layout-test').layout();

  // This code simply creates some coloured rectangles so that you can
  // see the layout without reaching for your developer tools!
  var c10 = d3.scale.category10();
  d3.selectAll("g").filter(function (d) {
      return this.childElementCount === 0;
    })
    .append('rect')
    .attr('stroke', function (d, i) { return c10(i); })
    .attr('fill', function (d, i) { return c10(i); })
    .attr('width', function () {
      return d3.select(this.parentNode).layout('width');
    })
    .attr('height', function () {
      return d3.select(this.parentNode).layout('height')}
    );
---

The layout functionality allows you to structure your SVG using CSS Flexbox. This removes much of the manual layout calculations that are typically required for D3 charts, [as described in this blog post](http://blog.scottlogic.com/2015/02/02/svg-layout-flexbox.html).

In order to use this layout approach, add the `layout-style` attribute to the elements within your `SVG` container (note the camel-cased property names). This component uses Facebook's css-layout project, which re-implements flexbox in JavaScript, [refer to their project page](https://github.com/facebook/css-layout) for supported properties.

Here's an example SVG with group elements that have a layout suitable for chart construction (axes, legend, etc ...):

```html
{{{example-html}}}
```

The following code performs the required layout:

```js
{{{example-code}}}
```

Nodes are positioned and sized appropriately using a combination of `x`, `y`, `width`, `height` and `transform` attributes depending on the whether the node is an `svg`, `rect` or other. Additionally `layout-width`, `layout-height`, `layout-x` and `layout-y` attributes are added which can be accessed using e.g. `selection.layout('width')`.

The above code produces the following:

{{{example-html}}}
<script type="text/javascript">
(function () {
    {{{example-code}}}
}());
</script>

To construct a chart, just select the required group elements and populate with your content.

You can also use the layout component programmatically by using the layout component to add the flexbox styles:

```js
svg.append('g')
  .layout({
      'height': 30,
      'justifyContent': 'center',
      'flexDirection': 'row'
  });
```

When building high performance charts e.g. when targeting 60fps, `selection.layout()` can be a source of performance problems. So in order to get the best performance, it's worth taking the time to understand some of its internals.

At a high level, when a node is laid-out -

* if it has not previously been laid-out it, its inner dimensions are measured. These are then collected, along with its `layout-style` and those of its descendants. After running these through the `css-layout` algorithm, the results are then applied node-by-node to the subtree.

* if it has previously been laid-out, its inner dimensions are not measured. Instead the `layout-width`, `layout-height`, `layout-x` and `layout-y` attributes, set on it when one of its ancestors was laid-out, will be used as the basis for the algorithm. These are combined with the `layout-style` attributes of the node and its descendants then applied to the subtree as above.

Once a descendant node has been laid-out, to avoid triggering further browser reflows, dimensions should be read from the `layout-width` and `layout-height` attributes. As described above `selection.layout('width')` and `selection.layout('height')` provide a convenient way of accessing these values.

It should be noted that `layout-width` and `layout-height` attributes are explicitly **not** set on the node which is being laid-out (typically the top level SVG node). By doing so the layout ensures that it will measure the top level node's inner dimensions on every call and is thus able to respond to resizing etc..

For optimal performance, it is therefore best to first layout the root node of your chart and then call layout as required on its descendants. This technique allows for optimal rendering by preventing the interlacing of reflow-triggering DOM reads and writes.

Whilst this will ensure that layout runs as fast as possible, it still has a non-zero cost, so when possible it is best to avoid running it completely. Helpfully layout is generally only required in a handful of cases e.g. when a chart is first rendered, when resizing or when panels are added or removed. It is therefore possible to programmatically suspend the work done by all `selection.layout()` operations within an SVG by using `selection.layoutSuspended(true)`. Subsequent calls to `selection.layout()` will be no-ops until `selection.layoutSuspended(false)` is invoked.
