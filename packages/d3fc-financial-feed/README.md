# d3fc-financial-feed

An API for fetching financial time-series data from different sources including GDAX.

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installing

```bash
npm install @d3fc/d3fc-financial-feed
```

## API Reference

* [GDAX](#gdax)

### GDAX

``` javascript
import { feedGdax } from 'd3fc-financial-feed';

const gdax = feedGdax()
  .product('BTC-GBP');

gdax()
  .then(data => { console.log(data); });

// [
//   {
//     date: 2016-05-11T08:51:00.000Z,
//     open: 317.99,
//     high: 317.99,
//     low: 317.99,
//     close: 317.99,
//     volume: 0.24
//   },
//   ...
// ]
```

https://docs.gdax.com/#get-historic-rates

<a name="feedGdax" href="#feedGdax">#</a> fc.**feedGdax**()

Constructs a new GDAX feed.

<a name="feedGdax_" href="#feedGdax_">#</a> *feedGdax*()

Makes a request to the GDAX API, returns a `Promise` which resolves with data.
Data returned from the API is mapped to an array of objects with numeric
`open`, `high`, `low`, `close` and `volume` properties, and a `Date` instance `date` property.

<a name="feedGdax_product" href="#feedGdax_product">#</a> *feedGdax*.**product**([*value*])

If *value* is specified, sets the product id to the specified string and returns this feed instance.
If *value* is not specified, returns the current product id, which defaults to `"BTC-USD"`.

<a name="feedGdax_start" href="#feedGdax_start">#</a> *feedGdax*.**start**([*value*])

If *value* is specified, sets the start date to the specified `Date` object and returns this feed instance.
If *value* is not specified, returns the current start date, which defaults to null.

<a name="feedGdax_end" href="#feedGdax_end">#</a> *feedGdax*.**end**([*value*])

If *value* is specified, sets the end date to the specified `Date` object and returns this feed instance.
If *value* is not specified, returns the current end date, which defaults to null.

<a name="feedGdax_granularity" href="#feedGdax_granularity">#</a> *feedGdax*.**granularity**([*value*])

If *value* is specified, sets the granularity to the specified number of seconds and returns this feed instance.
If *value* is not specified, returns the current granularity, which defaults to null.

