import d3 from 'd3';

export function isIntersecting(a, b) {
    return !(a.x >= (b.x + b.width) ||
       (a.x + a.width) <= b.x ||
       a.y >= (b.y + b.height) ||
       (a.y + a.height) <= b.y);
}

export function areaOfIntersection(a, b) {
    var left = Math.max(a.x, b.x);
    var right = Math.min(a.x + a.width, b.x + b.width);
    var top = Math.max(a.y, b.y);
    var bottom = Math.min(a.y + a.height, b.y + b.height);
    return (right - left) * (bottom - top);
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
