# d3fc-sample

A D3 component for down-sampling data using a variety of methods. Data is typically partitioned into equally-sized buckets, and one data point from each bucket is chosen. The algorithms employed here are Largest Triangle 1 (or 3) Bucket, or Mode-Median as detailed in the thesis [Downsampling Time Series for Visual Representation](http://skemman.is/stream/get/1946/15343/37285/3/SS_MSthesis.pdf).


![d3fc sample](d3fc-sample.png)

For a live demo, see the [GitHub Pages site](http://d3fc.github.io/d3fc-sample/).

[Main d3fc package](https://github.com/ScottLogic/d3fc)

# Installation

```bash
npm install d3fc-sample
```

# API

## General API

The sampling components provide an API for downsampling data. They are typically used to improve rendering performance of charts or maps when there is a significant amount of data. The data is passed to the component, which then returns a smaller downsampled array.

## Example usage

```javascript
// Create the sampler
var sampler = fc_sample.largestTriangleThreeBucket();

// Configure the x / y value accessors
sampler.x(function (d) { return d.x; })
    .y(function (d) { return d.y; });

// Configure the size of the buckets used to downsample the data.
sampler.bucketSize(10);

// Run the sampler
var sampledData = sampler(data);
```

## Mode Median

The mode-median sampler is fairly basic. It partitions the data, then selects a representative piece of data from that set: the mode -- if it exists -- or the median.

*fc*.**modeMedian**()

Constructs a new sampler.

*modeMedian*.**value**(*accessorFunc*)

Specifies the accessor function used to obtain the value from the supplied array of data. The accessor function is invoked exactly once per datum, and should return the value to be down-sampled.

*modeMedian*.**bucketSize**(*size*)

Denotes the amount of data points for each bucket. The first and last data points are always their own bucket. The second-last bucket will be of size `(data.length - 2) % size`.

**modeMedian**(*data*)

Runs the sampler. It returns the downsampled data (it doesn't modify the `data` array itself). The downsampler selects the mode (if it exists), or the median value.

## Largest Triangle

Largest Triangle is a sampler where, given two pre-determined points, the point in the bucket that forms the largest triangle has the largest effective area and so is the most important in the bucket. The largest triangle algorithm comes in two flavours -- one bucket and three bucket. The algorithms are described in detail in the thesis [Downsampling Time Series for Visual Representation](http://skemman.is/stream/get/1946/15343/37285/3/SS_MSthesis.pdf), with a summary of their descriptions reproduced here:

### Largest Triangle One Bucket

> This algorithm is very simple. First all the points are ranked by calculating their effective areas. Points with effective areas as null are excluded. The data points are then split up into approximately equal number of buckets as the specified downsample threshold. Finally, one point with the highest rank (largest effective area) is selected to represent each bucket in the downsampled data.

> The effective area of a point is the area size of a triangle it forms with its two adjacent points.

![largest triangle one bucket illustration](largest-triangle-one-bucket.png)

### Largest Triangle Three Buckets

> The algorithm works with three buckets at a time and proceeds from left to right. The first point which forms the left corner of the triangle (the effective area) is always fixed as the point that was previously selected and one of the points in the middle bucket shall be selected now.

The point used to form the triangle in the last bucket is a temporary point which is teh average of all other points within that bucket.

![largest triangle three bucket illustration](largest-triangle-three-bucket.png)


*fc*.**largestTriangleOneBucket**()

*fc*.**largestTriangleThreeBucket**()

Constructs a new sampler. The API is the same for both samplers, aside from this constructor.

*largestTriangle*.**x**(*accessorFunc*)

*largestTriangle*.**y**(*accessorFunc*)

Specifies the accessor function used to obtain the x and y values from the supplied array of data. The accessor function is invoked exactly once per datum, and should return the value to be down-sampled.

*largestTriangle*.**bucketSize**(*size*)

Denotes the amount of data points for each bucket. The first and last data points are always their own bucket. The second-last bucket will be of size `(data.length - 2) % size`.

**largestTriangle**(*data*)

Runs the sampler, returning the downsampled data (it doesn't modify the `data` array itself). The sampler selects the point in the bucket with the largest area between two other points (determined by algorithm).

## Bucket

d3fc-sample also comes with a data bucket utility, used by the algorithms. It partitions data into evenly-sized chunks, with the first and last bucket being their own.

*fc*.**bucket**()

Construct a data bucket utility instance.

*bucket*.**bucketSize**(*size*)

Denotes the amount of data points for each bucket. The first and last data points are always their own bucket. The second-last bucket will be of size `(data.length - 2) % size`.

**bucket**(*data*)

Partitions the data into evenly sized buckets, in the form:

```
[
    [data[0]],
    [data[1], data[2], ..., data[n]],
    [data[n + 1], data[n + 2], ..., data[2n]],
    ...
    [data[data.length - 1]]
]
```
