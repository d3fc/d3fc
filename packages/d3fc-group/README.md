# d3fc-group

A utility for manipulating CSV / TSV data to allow rendering of grouped series.

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installation

```bash
npm install @d3fc/d3fc-group
```

## API Reference

### General API

The [d3-dsv](https://github.com/d3/d3-dsv) package provides a number of utilities for parsing delimiter-separated values, such as comma-separated (CSV) or tab-separated (TSV). Given a DSV input these parsers produce an array of objects, with properties that correspond to the columns.

For example, using a subset of the data from [this D3 example](https://bl.ocks.org/mbostock/3887051), a simple CSV is parsed as follows:

```javascript
const data = d3.csvParse(
    `State,Under 5 Years,5 to 13 Years
    AL,310,552
    AK,52,85
    AZ,515,828`);
```

Resulting in the following structure:

```javascript
[
   {'State': 'AL', 'Under 5 Years': '310', '5 to 13 Years': '552' },
   {'State': 'AK', 'Under 5 Years': '52', '5 to 13 Years': '85' },
   {'State': 'AZ', 'Under 5 Years': '515', '5 to 13 Years': '828' }
];
```

The group component takes this structure and manipulates it into a form that is more appropriate for rendering each row as an individual series within a grouped chart.

Here is how the group component can be applied to the above output:

```javascript
const group = fc.group()
  .key('State');
const grouped = group(data);
```

The default group orientation is 'vertical', which creates a 'series' for each of the columns, other than the one which represents the key. With this example, a vertical group is as follows:

```javascript
[
  [["AL", 310], ["AK", 52], ["AZ", 515]],
  [["AL", 552], ["AK", 85], ["AZ", 828]]
]
```

This structure very similar to the output of [d3.stack](https://github.com/d3/d3-shape#stacks) and is suitable for rendering grouped series, in this case grouping by state.

The key for each series is available as *series*.key and the input data element for each point is available as *point*.data.

```javascript
const group = fc.group()
  .key('State');
const grouped = group(data);
// [
//   [["AL", 310], ["AK", 52], ["AZ", 515]],
//   [["AL", 552], ["AK", 85], ["AZ", 828]]
// ]

// each series has a key property
grouped[0].key // 'Under 5 Years'
grouped[1].key // '5 to 13 Years'

// and each data element has a data property:
grouped[0][0].data //  {'State': 'AL', 'Under 5 Years': '310', '5 to 13 Years': '552' }
```

You can also perform a horizontal grouping, as illustrated in the following example:

```javascript
const group = fc.group()
  .orient('horizontal')
  .key('State');
const grouped = group(data);
```

Which creates a series for each row, in this case allowing grouping by age-band:

```javascript
[
  [["Under 5 Years", 310], ["5 to 13 Years", 552]],
  [["Under 5 Years", 52 ], ["5 to 13 Years", 85 ]],
  [["Under 5 Years", 515], ["5 to 13 Years", 828]]
]
```


### API

<a name="group" href="#group">#</a> fc.**group**()

Constructs a new group generator with the default settings.

<a name="group_key" href="#group_key">#</a> *group*.**key**(*keyValue*)

If *keyValue* is specified, sets the name of the column within the DSV data that represents the key. If *keyValue* is not specified, returns the current key.

<a name="group_value" href="#group_value">#</a> *group*.**value**(*valueFunc*)

If *valueFunc* is specified, sets the accessor function used to obtain the value for a specific row / column. If *valueFunc* is not specified, returns the current accessor.

The accessor is invoked each time the group component obtains the value for a cell. The `valueFunc(row, column)` function is invoked with the current row (as supplied by the DSV parser) and the name of the column. The default implementation of this accessor function coerces all cell values to be Number instances.

<a name="group_orient" href="#group_orient">#</a> *group*.**orient**(*orientation*)

If *orientation* is specified, sets the orientation of the group operation. If *orientation* is not specified, returns the current orientation.
