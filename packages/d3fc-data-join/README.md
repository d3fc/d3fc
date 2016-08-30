# d3fc-data-join

A wrapper around D3's data join which simplifies some of the common problems that have been run into with *our particular usage patterns*, and facilitates the *d3fc decorate* pattern. These are not going to be universally applicable. As always it’s important to understand the abstraction and in many cases a vanilla data join may be simpler or perform better.

This blog post ([Building Components with Data Join](http://blog.scottlogic.com/2016/08/17/building-components-with-d3-data-join.html)) introduces the rationale behind this component.

[Main d3fc package](https://github.com/ScottLogic/d3fc)

## Installing

```bash
npm install d3fc-data-join
```

## API Reference

The data-join component is a relatively lightweight wrapper around d3's selectAll/data data-join, which allows decoration of the result. This is achieved by appending the element to the enter selection before exposing it. A default transition of fade in/out is also implicitly added but can be modified.

<a name="dataJoin" href="#dataJoin">#</a> fc.**dataJoin**([*element*][, *className*])

Constructs a new data-join component instance. Optionally an `element` or an `element` and a `className` can be specified, this is functionally equivalent to calling their methods as defined below.

Once created, the component must be invoked with a `selection` containing the parent element and the `data` to be joined.

```js
import { dataJoin } from 'd3fc-data-join';
import { select } from 'd3-selection';

const join = dataJoin('li', 'animal');

join(select('ul'), ['Aardvark', 'Beaver', 'Cat'])
  .text(d => d);
```

The return value is a selection containing all new and existing nodes. Two additional methods are exposed for retrieving a selection containing only the new nodes (`.enter()`) and the removed nodes (`.exit()`).

```js
import { dataJoin } from 'd3fc-data-join';
import { select } from 'd3-selection';

const join = dataJoin('li', 'animal');

const update = join(select('ul'), ['Aardvark', 'Beaver', 'Cat'])
  .text(d => d);

update.enter()
  .attr('data-', d => d);

```

If `d3-transition` is available, new nodes will have a fade-in transition applied and removed nodes will have a fade-out transition applied. The transition timings can be controlled from the node selection passed in or one of the ancestors there of.

```js
import { dataJoin } from 'd3fc-data-join';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

const quickTransition = transition()
.duration(300);

const join = dataJoin('li', 'animal')
  .transition(quickTransition);

join(select('ul'), ['Aardvark', 'Beaver', 'Cat'])
  .text(d => d);
```

<a name="dataJoin_element" href="#dataJoin_element">#</a> *dataJoin*.**element**(*element*)

Sets the element name used to select elements and to create elements for insertion. Defaults to an SVG `g` element. See `className` for a description of the selector used.

<a name="dataJoin_className" href="#dataJoin_className">#</a> *dataJoin*.**className**(*className*)

Set the class name used to select elements and applied to inserted elements. Defaults to `null`. If set to `null`, only the `element` is used as the selector. If non-null, the selector provided to `selectAll` is -

```js
`${element}.${className}`
```

<a name="dataJoin_key" href="#dataJoin_key">#</a> *dataJoin*.**key**(*keyFunc*)

Specifies the key function used by the data-join. Defaults to index-based. Equivalent to specifying a `key` argument when calling [`selection.data()`](https://github.com/d3/d3-selection#selection_data).

<a name="dataJoin_transition" href="#dataJoin_transition">#</a> *dataJoin*.**transition**(*transition*)

Specifies the transition to be used if `d3-transition` is available. Defaults to `null` which uses the default transition,`. Equivalent to specifying a `key` argument when calling `[selection.data()](https://github.com/d3/d3-selection#selection_data)`.
