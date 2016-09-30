---
name: pointer-api
structure:
  - title: d3fc-pointer
    level: 1
    content: >+
      Very simple component which emits an event to indicate the current mouse
      or touch position over a selection. Useful for implementing
      uni-directional data flow in a visualisation and not a lot else.

    children:
      - title: API Reference
        level: 2
        content: >
          <a name="pointer" href="#pointer">#</a> fc.**pointer**()


          Constructs a new pointer component instance.


          <a name="pointer_on" href="#pointer_on">#</a>
          *pointer*.**on**(*typenames*[, *callback*])


          This component dispatches `pointer` events. The sole argument to the
          event handler is an array. If the mouse or touch interaction is over
          the selection then the array will contain a single object representing
          the co-ordinate (e.g. `{ x: 10, y: 10 }`). If the mouse or touch
          interaction is not over the selection then the array will be empty.


          See [d3-dispatch's
          `on`](https://github.com/d3/d3-dispatch#dispatch_on) for a full
          description.
sidebarContents: []
layout: api
section: api
title: Pointer

---
