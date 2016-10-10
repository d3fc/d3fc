---
name: element-api
structure:
  - title: d3fc-element
    level: 1
    content: "Custom HTML elements that make it easier to create responsive d3 visualisations using CSS that integrate easily with other UI frameworks (e.g. React, Angular)\r\n\r\n"
    children:
      - title: Installation
        level: 2
        content: "```bash\r\nnpm install d3fc-element\r\n```\r\n\r"
      - title: API Reference
        level: 2
        content: "* [&lt;d3fc-svg&gt;](#d3fc-svg)\r\n* [&lt;d3fc-canvas&gt;](#d3fc-canvas)\r\n* [&lt;d3fc-group&gt;](#d3fc-canvas)\r\n\r\n"
        children:
          - title: '&lt;d3fc-svg&gt;'
            level: 3
            content: ''
          - title: '&lt;d3fc-canvas&gt;'
            level: 3
            content: "These elements provide a nested `svg` or `canvas` element as a rendering surface for D3 visualisations. Use CSS to size the element and its pixel dimensions will be automatically propagated through to the nested element.\r\n\r\nRendering is internally a three-phase process which is automatically aligned to animation frames, *measure*, *resize* (if required) and *draw*.  The *resize* and *draw* phases emit similarly named events to allow rendering code to be called.\r\n\r\nThe split is required to allow the measuring logic to be performed across all surfaces in the document before any rendering takes place. This prevents layout thrashing by preventing interleaving of DOM reads (which occur in *measure*) with DOM writes (which should occur in *draw*).\r\n\r\n```html\r\n<d3fc-svg id=\"x-axis\" style=\"width: 10vw; height: 6vw\"></d3fc-svg>\r\n```\r\n\r\n```js\r\nconst xScale = d3.scaleLinear()\r\n  .domain([0, 10]);\r\n\r\nconst xAxis = d3.axisBottom(xScale);\r\n\r\nconst xAxisContainer = d3.select('#x-axis')\r\n  .on('resize', () => {\r\n    const { detail: { width } } = d3.event;\r\n    xScale.range([0, width]);\r\n  })\r\n  .on('draw', () => {\r\n    const { detail: { selection } } = d3.event;\r\n    selection.call(xAxis);\r\n  });\r\n\r\n// Some time later...\r\nsetTimeout(() => {\r\n  // ...a change requiring a redraw occurs...\r\n  xScale.domain([0, 5]);\r\n  // ...so we request a redraw of the element.\r\n  xAxisContainer.node()\r\n    .requestRedraw();\r\n}, 1000);\r\n```\r\n\r\n\r\n<a name=\"surface_requestRedraw\" href=\"#surface_requestRedraw\">#</a> *surface*.**requestRedraw**()\r\n\r\nEnqueues a redraw to occur on the next animation frame, only if there isn't already one pending. If one is already pending, this call is ignored.\r\n\r\nIt should be noted that `requestRedraw` is asynchronous. It does not directly invoke the draw event so any errors thrown in the event handler can not be caught.\r\n\r"
          - title: '&lt;d3fc-group&gt;'
            level: 3
            content: "An element with no visual representation that is designed to group related rendering surfaces ([&lt;d3fc-svg&gt;](#d3fc-svg)/[&lt;d3fc-canvas&gt;](#d3fc-canvas)). Its core purpose is to multi-cast [*group*.requestRedraw](#group-requestRedraw) calls to descendant surfaces and to provide an aggregate draw event. It additionally provides helpers to allow [auto-resizing](#group-autoResize) of descendant surfaces in response to window `resize` events.\r\n\r\n```html\r\n<d3fc-group id=\"chart\" auto-resize style=\"display: flex; height: 40vw; width: 60vw; flex-direction: column\">\r\n  <h1 style=\"text-align: center\">\r\n    A Cartesian Chart\r\n  </h1>\r\n  <div style=\"flex: 1; display: flex; flex-direction: row\">\r\n    <d3fc-svg id=\"plot-area\" style=\"flex: 1\"></d3fc-svg>\r\n    <d3fc-svg id=\"y-axis\" style=\"width: 5em\"></d3fc-svg>\r\n  </div>\r\n  <div style=\"height: 3em; display: flex; flex-direction: row\">\r\n    <d3fc-svg id=\"x-axis\" style=\"flex: 1; margin-right: 5em\"></d3fc-svg>\r\n  </div>\r\n</d3fc-group>\r\n```\r\n\r\n<a name=\"group-autoResize\" href=\"#group-autoResize\">#</a> *group*.**autoResize** = *autoResize*\r\n\r\nAvailable as the property `autoResize` or the attribute `auto-resize`. If `true`, listens to `window` `resize` events and automatically invokes [*group*.requestRedraw](#group-requestRedraw).\r\n\r\n<a name=\"group_requestRedraw\" href=\"#group_requestRedraw\">#</a> *group*.**requestRedraw**()\r\n\r\nEquivalent to invoking [*surface*.requestRedraw](#surface-requestRedraw) on all descendant group or surface elements. The order of events emitted on this and descendent groups or surfaces is guaranteed to be in document order (even if a redraw request on one of those elements occurs before or after this call).\r\n\r"
          - title: Events
            level: 3
            content: "The following custom DOM events are emitted by the elements -\r\n\r\n* `resize` - indicates that the rendering surface has been resized (only [&lt;d3fc-svg&gt;](#d3fc-svg)/[&lt;d3fc-canvas&gt;](#d3fc-canvas)). Typically the `resize` event is used to set the [range](https://github.com/d3/d3-scale#continuous_range) on scales or apply transforms.\r\n* `draw` - indicates that the rendering surface requires drawing. Typically the `draw` event is used to render components or perform any bespoke data-joins.\r\n\r\nThe following properties are available under the `detail` property on the event (not available for [&lt;d3fc-group&gt;](#d3fc-group)) -\r\n\r\n* `width` - the width of the surface in pixels.\r\n* `height` - the height of the surface in pixels.\r\n* `resized` - flag indicating whether the element has resized since the last draw.\r\n* `node` - the surface node.\r\n* `selection` - a d3 selection containing only `node`.\r\n* `context` - the 2d rendering context retrieved from `node` ([&lt;d3fc-canvas&gt;](#d3fc-canvas) only).\r\n\r\nN.B. it is safe to immediately invoke [*surface*.requestRedraw](#surface_requestRedraw) from event handlers if you wish to create an animation. The redraw will be scheduled for the subsequent animation frame.\r\n"
sidebarContents:
  - title: '&lt;d3fc-svg&gt;'
    id: lt-d3fc-svg-gt
  - title: '&lt;d3fc-canvas&gt;'
    id: lt-d3fc-canvas-gt
  - title: '&lt;d3fc-group&gt;'
    id: lt-d3fc-group-gt
  - title: Events
    id: events
layout: api
section: api
title: Element

---
