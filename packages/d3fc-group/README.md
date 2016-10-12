# d3fc-spread

A utility for manipulating CSV / TSV data to allow rendering of stacked or grouped series. The spread component converts the output of the D3 DSV (CSV / TSV) parser into an array of series; one per column (vertical spread), or one per row (horizontal spread).

[Main d3fc package](https://github.com/ScottLogic/d3fc)

## Installation

```bash
npm install d3fc-spread
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
    AZ,515,828
`);
```

Resulting in the following structure:

```javascript
[
   {'State': 'AL', 'Under 5 Years': '310', '5 to 13 Years': '552' },
   {'State': 'AK', 'Under 5 Years': '52', '5 to 13 Years': '85' },
   {'State': 'AZ', 'Under 5 Years': '515', '5 to 13 Years': '828' }
];
```

The spread component takes this structure and manipulates it into a form that is more appropriate for rendering each row as an individual series, or as a grouped / stacked chart.

Here is how the spread component can be applied to the above output:

```javascript
const spread = fc.spread()
  .key('State');
const series = spread(data);
```

The default spread orientation is 'vertical', which creates a 'series' for each of the columns, other than the one which represents the key. With this example, a vertical spread is as follows:

```javascript
[
  {
    "key": "Under 5 Years",
    "values": [
      { "x": "AL", "y": 310 },
      { "x": "AK", "y": 52 },
      { "x": "AZ", "y": 515 }
    ]
  },
  {
    "key": "5 to 13 Years",
    "values": [
      { "x": "AL", "y": 552 },
      { "x": "AK", "y": 85 },
      { "x": "AZ", "y": 828 }
    ]
  }
]
```

This structure is suitable for rendering grouped series, in this case grouping by age band.

You can also perform a horizontal spread:

```javascript
const spread = fc.spread()
  .orient('horizontal')
  .key('State');
const series = spread(data);
```

Which creates a series for each row:

```javascript
[
  {
    "key": "AL",
    "values": [
      { "x": "Under 5 Years", "y": 310 },
      { "x": "5 to 13 Years", "y": 552 }
    ]
  },
  {
    "key": "AK",
    "values": [
      { "x": "Under 5 Years", "y": 52 },
      { "x": "5 to 13 Years", "y": 85 }
    ]
  },
  {
    "key": "AZ",
    "values": [
      { "x": "Under 5 Years", "y": 515 },
      { "x": "5 to 13 Years", "y": 828 }
    ]
  }
]
```

This structure is suitable for rendering each row as an individual series, or as a stacked chart.

### API

<a name="spread" href="#spread">#</a> fc.**spread**()

Constructs a new spread transform.

<a name="spread_key" href="#spread_key">#</a> *spread*.**key**(*keyValue*)

If *keyValue* is specified, sets the name of the column within the DSV data that represents the key. If *keyValue* is not specified, returns the current key.

<a name="spread_cellValue" href="#spread_cellValue">#</a> *spread*.**cellValue**(*cellValueFunc*)

If *cellValueFunc* is specified, sets the accessor function used to obtain the value for a specific row / column. If *cellValueFunc* is not specified, returns the current accessor.

The accessor is invoked each time the spread component obtains the value for a cell. The `cellValueFunc(row, column)` function is invoked with the current row (as supplied by the DSV parser) and the name of the column. The default implementation of this accessor function coerces all cell values to be Number instances.

<a name="spread_orient" href="#spread_orient">#</a> *spread*.**orient**(*orientation*)

If *orientation* is specified, sets the orientation of the spread operation. If *orientation* is not specified, returns the current orientation.
