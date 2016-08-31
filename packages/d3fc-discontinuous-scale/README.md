# d3fc-discontinuous-scale

A D3 scale that supports domains that are not continuous, creating gaps, or discontinuities. For example, this can be used to create a linear scale that has certain ranges removed, creating discontinuities in the rendered axis, or it can be used in conjunction with a time scale, in order to 'skip' weekends.

[Main d3fc package](https://github.com/ScottLogic/d3fc)

## Installing

```bash
npm install d3fc-discontinuous-scale
```

## API Reference

* [scaleDiscontinuous](#scaleDiscontinuous)
* [discontinuityIdentity](#discontinuityIdentity)
* [discontinuityRange](#discontinuityRange)
* [discontinuitySkipWeekends](#discontinuitySkipWeekends)
* [Discontinuity provider interface](#discontinuity-provider-interface)

The discontinuous scale adapts a D3 scale, with an associated discontinuity provider supplying the information relating to any 'gaps' in the scale. The following example shows an adapted linear scale, with a discontinuity which removes the domain range `[50, 75]`:

```javascript
import { scaleDiscontinuous, discontinuityRange } from 'd3fc-discontinuous-scale';
import { scaleLinear, axisBottom } from 'd3-scale';

var scale = scaleDiscontinuous(scaleLinear())
    .discontinuityProvider(discontinuityRange([50, 75]))
    .domain([0, 100])
    .range([0, 550]);

var axis = axisBottom()
    .scale(scale);
```

Which renders as follows:

![](discontinuous-scale.png)

There are various different discontinuity providers which can be used with the discontinuous scale. It is also possible to write your own.

### scaleDiscontinuous

<a name="scaleDiscontinuous" href="#scaleDiscontinuous">#</a> fc.**scaleDiscontinuous**(*scale*)

Constructs a new discontinuous scale, adapting the given scale. If a *scale* is not specified, a D3 identity scale is used.

<a name="scaleDiscontinuous_" href="#scaleDiscontinuous_">#</a> *scaleDiscontinuous*(*value*)
<a name="scaleDiscontinuous_invert" href="#scaleDiscontinuous_invert">#</a> *scaleDiscontinuous*.**invert**(*value*)

The underlying scale method, and the **invert** method are adapted to remove discontinuous. For example, a regular D3 linear scale performs as follows:

```javascript
const linear = scaleLinear()
    .domain([10, 110])
    .range([0, 960]);

linear(20); // 96
linear(50); // 384
```

Whereas a discontinuous scale (that adapts a linear), with a discontinuity that removes the domain range `[50, 80]`, gives a different output:

```javascript
const discontinuous = scaleDiscontinuous(scaleLinear())
    .discontinuityProvider(discontinuityRange([50, 70]))
    .domain([10, 110])
    .range([0, 960]);

discontinuous(20); // 120
discontinuous(50); // 480
```

The same behaviour is observed via **invert** also.

All of the adapted scale methods are re-exposed by the discontinuous scale. The discontinuous scale API documentation details where the scale behaviour differs from the adapted scale. For all other methods, you can assume that their behaviour is unchanged.

<a name="scaleDiscontinuous_domain" href="#scaleDiscontinuous_domain">#</a> *scaleDiscontinuous*.**domain**([*provider*])

Adapts the underlying scale's **domain** method, clamping the upper and lower domain bounds to ensure that they do not fall within a discontinuity.

<a name="scaleDiscontinuous_nice" href="#scaleDiscontinuous_nice">#</a> *scaleDiscontinuous*.**nice**()

Adapts the underlying scale's **nice** method, clamping the resulting domain to ensure that the upper and lower bounds do not fall within a discontinuity.

<a name="scaleDiscontinuous_ticks" href="#scaleDiscontinuous_ticks">#</a> *scaleDiscontinuous*.**ticks**([*count*])

Adapts the underlying scale's **ticks** method, removing any ticks that fall within discontinuities.

<a name="scaleDiscontinuous_discontinuityProvider" href="#scaleDiscontinuous_discontinuityProvider">#</a> *scaleDiscontinuous*.**discontinuityProvider**(*provider*)

If *provider* is specified, sets the discontinuity provider for the scale. The discontinuity provider exposes an API that is used to create gaps within the domain. This package includes a number of different types of discontinuity provider, however you can also create your own.

### discontinuityIdentity

<a name="discontinuityIdentity" href="#discontinuityIdentity">#</a> fc.**discontinuityIdentity**()

The identity discontinuity provider does not define any discontinuities, and as a result, when associated with a discontinuities scale, the scale will perform in exactly the same way as the adapted scale.

### discontinuityRange

<a name="discontinuityRange" href="#discontinuityRange">#</a> fc.**discontinuityRange**(*ranges*)

This discontinuity provider defines one or more domain *ranges* which should be excluded from the scale. These ranges are supplied as tuples, for example, `discontinuityRange([0, 10], [20, 30])`. Both numeric and date ranges are supported, for example to create a range that skips a day, you can do the following:

```javascript
const start = new Date(2015, 0, 9);
const end = new Date(2015, 0, 10);
const range = discontinuityRange([start, end]);
```

### discontinuitySkipWeekends

<a name="discontinuitySkipWeekends" href="#discontinuitySkipWeekends">#</a> fc.**discontinuitySkipWeekends**()

This discontinuity provider is intended to be used with a time scale. This provider will remove all weekends from the domain, a feature which is particularly useful for financial time-series charts.

### Discontinuity provider interface

You can create your own discontinuity provider by providing an object that exposes the following methods:

 + `clampUp` - When given a value, if it falls within a discontinuity (i.e. an excluded domain range) it should be shifted forwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
 + `clampDown` - When given a value, if it falls within a discontinuity it should be shifted backwards to the discontinuity boundary. Otherwise, it should be returned unchanged.
 + `distance` - When given a pair of values, this function returns the distance between the, in domain units, minus any discontinuities.
 discontinuities.
 + `offset` - When given a value and an offset, the value should be advanced by the offset value, skipping any discontinuities, to return the final value.
 + `copy` - Creates a copy of the discontinuity provider.
