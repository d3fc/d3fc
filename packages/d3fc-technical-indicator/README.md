# d3fc-technical-indicator

Components for calculating technical indicators on data series.

[Main d3fc package](https://github.com/ScottLogic/d3fc)

## Installation

```bash
npm install d3fc-technical-indicator
```


# API

* [Bollinger Bands](#bollinger-bands)
* [Elder-Ray](#elder-ray)
* [Envelope](#envelope)
* [Moving Average](#moving-average)
* [Exponential Moving Average](#exponential-moving-average)
* [Force Index](#force-index)
* [MACD](#macd)
* [Relative Strength Index](#relative-strength-index)
* [Stochastic Oscillator](#stochastic-oscillator)

## General API

Pass an ordered array of data to a configured component instance to calculate a technical indicator of the data.
Input array elements have no set structure — you can configure accessor functions to retrieve the values required.
Parameters of indicators can be configured for each component instance, otherwise a default value will be used.

### Example usage

```javascript

import { bollingerBands } from d3fc-technical-indicator;

const bollingerGenerator = bollingerBands()
    .period(3);

bollingerGenerator([5, 6, 7, 6, 5, 4]);
// [
//   { upper: undefined, average: undefined, lower: undefined },
//   { upper: undefined, average: undefined, lower: undefined },
//   { upper: 8, average: 6, lower: 4 },
//   { upper: 7.4880338717125845, average: 6.333333333333333, lower: 5.178632794954082 },
//   { upper: 8, average: 6, lower: 4 },
//   { upper: 7, average: 5, lower: 3 }
// ]

```


## Bollinger Bands

*d3fc_indicator*.**bollingerBands**()

Constructs a new Bollinger band generator with the default settings.

*bollingerBands*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

*bollingerBands*.**period**([*size*])

Get/set the period of the moving average and standard deviation calculations performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 10.

*bollingerBands*.**multiplier**([*multiplier*])

Get/set the multiplier of the of the standard deviation around the moving average for the upper and lower bands. Defaults to 2.

*bollingerBands*(*data*)

Computes the Bollinger bands for the given data array. Returns an array of objects with attributes:
* `upper`: Upper Bollinger band
* `average`: Simple moving average
* `lower`: Lower Bollinger band


## Elder-Ray

*d3fc_indicator*.**elderRay**()

Constructs a new Elder-ray generator with the default settings.

*elderRay*.**closeValue**([*value*])

Get/set the accessor function used to obtain the close price value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.close`.

*elderRay*.**highValue**([*value*])

Get/set the accessor function used to obtain the high price value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.high`.

*elderRay*.**lowValue**([*value*])

Get/set the accessor function used to obtain the low price value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.low`.

*elderRay*.**period**([*period*])

Get/set the period of the moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 13.

*elderRay*(*data*)

Computes the Elder-ray for the given data array. Returns an array of objects with attributes:
* `bullPower`: Data highValue - EMA of specified period
* `bearPower`: Data lowValue - EMA of specified period


## Envelope

*d3fc_indicator*.**envelope**()

Constructs a new envelope generator with the default settings.

*envelope*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

*envelope*.**factor**([*factor*])

Get/set the multiplier used to obtain the upper and lower levels from the datum values. Defaults to 2.

*envelope*(*data*)

Computes the envelope for the given data array. Returns an array of objects with attributes:
* `upper`: Upper level
* `lower`: Lower level


## Moving Average

*d3fc_indicator*.**movingAverage**()

Constructs a new simple moving average generator with the default settings.

*movingAverage*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

*movingAverage*.**period**([*size*])

Get/set the period of the moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 10.

*movingAverage*(*data*)

Computes the moving average for the given data array. Returns an array of simple moving average values.


## Exponential Moving Average

*d3fc_indicator*.**exponentialMovingAverage**()

Constructs a new exponential moving average generator with the default settings.

*exponentialMovingAverage*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

*exponentialMovingAverage*.**period**([*size*])

Get/set the period of the exponential moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 9.

*exponentialMovingAverage*(*data*)

Computes the exponential moving average for the given data array. Returns an array of exponential moving average values.


## Force Index

*d3fc_indicator*.**forceIndex**()

Constructs a new force index generator with the default settings.

*forceIndex*.**closeValue**([*value*])

Get/set the accessor function used to obtain the close price value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.close`.

*forceIndex*.**volumeValue**([*value*])

Get/set the accessor function used to obtain the trade volume value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.volume`.

*forceIndex*.**period**([*size*])

Get/set the period of the exponential moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 13.

*forceIndex*(*data*)

Computes the force index for the given data array. Returns an array of force index values.


## MACD

*d3fc_indicator*.**macd**()

Constructs a new MACD generator with the default settings.

*macd*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

*macd*.**fastPeriod**([*period*])

Get/set the period of the 'fast' exponential moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 12.

*macd*.**slowPeriod**([*period*])

Get/set the period of the 'slow' exponential moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 26.

*macd*.**signalPeriod**([*period*])

Get/set the period of the 'signal' exponential moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 9.

*macd*(*data*)

Computes the MACD for the given data array. Returns an array of objects with attributes:
* `macd`
* `signal`
* `divergence`


## Relative Strength Index

*d3fc_indicator*.**relativeStrengthIndex**()

Constructs a new RSI generator with the default settings.

*relativeStrengthIndex*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

*relativeStrengthIndex*.**period**([*size*])

Get/set the period of the relative strength index calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 14.

*relativeStrengthIndex*(*data*)

Computes the RSI for the given data array. Returns an array of RSI values.


## Stochastic Oscillator

*d3fc_indicator*.**stochasticOscillator**()

Constructs a new stochastic oscillator generator with the default settings.

*stochasticOscillator*.**closeValue**([*value*])

Get/set the accessor function used to obtain the close price value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.close`.

*stochasticOscillator*.**highValue**([*value*])

Get/set the accessor function used to obtain the high price value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.high`.

*stochasticOscillator*.**lowValue**([*value*])

Get/set the accessor function used to obtain the low price value to be used by the generator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.low`.

*stochasticOscillator*.**kPeriod**([*size*])

Get/set the period of the '%K' calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 5.

*stochasticOscillator*.**dPeriod**([*size*])

Get/set the period of the '%D' moving average calculation performed by the generator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 3.

*stochasticOscillator*(*data*)

Computes an array of stochastic oscillator values from the given input array.
