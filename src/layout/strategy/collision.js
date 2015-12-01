import d3 from 'd3';

function isIntersecting(a, b) {
    return areaOfIntersection(a, b) > 0;
}

function areaOfIntersection(a, b) {
    var left = Math.max(a.x, b.x);
    var right = Math.min(a.x + a.width, b.x + b.width);
    var top = Math.max(a.y, b.y);
    var bottom = Math.min(a.y + a.height, b.y + b.height);
    return (right - left) * (bottom - top);
}

function collideAll(data) {
    var collisions = [];
    for (var i = 0; i < data.length; i++) {
        collisions = collisions.concat(collidePoint(data, i));
    }
    return collisions;
}

function collidePoint(data, pointIndex) {
    var pointA = data[pointIndex];
    return data.filter(isIntersecting.bind(null, pointA)).map(function(pointB) {
        return [pointA, pointB];
    });
}

export function allCollisionIndices(data) {
    var collisions = collideAll(data);

    // Convert [[a, b], [a, c]] => [a, b, c]
    var uniqueCollisions = collisions.map(function(d) {
        return data.indexOf(d[0]);
    }).filter(function(d, i, arr) {
        return arr.indexOf(d) === i;
    });

    return uniqueCollisions;
}

export function collidingWith(rectangles, index) {
    var rectangle = rectangles[index];

    // Filter all rectangles that aren't the selected rectangle
    // and the filter if they intersect.
    return rectangles.filter(function(_, i) {
        return index !== i;
    }).filter(function(d) {
        return isIntersecting(d, rectangle);
    });
}

export function collisionArea(rectangles, index) {
    var rectangle = rectangles[index];
    var collisions = collidingWith(rectangles, index);

    return d3.sum(collisions.map(function(d) {
        return areaOfIntersection(rectangle, d);
    }));
}

export function totalCollisionArea(rectangles) {
    return d3.sum(rectangles.map(function(_, i) {
        return collisionArea(rectangles, i);
    }));
}
