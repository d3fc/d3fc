import d3 from 'd3';

function isIntersecting(a, b) {
    return !(a.x >= (b.x + b.width) ||
        (a.x + a.width) <= b.x ||
        a.y >= (b.y + b.height) ||
        (a.y + a.height) <= b.y);
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

export function allWithCollisions(data) {
    var collisions = collideAll(data);

    // Convert [[a, b], [a, c]] => [a, b, c]
    var uniqueCollisions = [];
    collisions.forEach(function(collision) {
        var pointA = data.indexOf(collision[0]);
        var pointB = data.indexOf(collision[1]);

        if (uniqueCollisions.indexOf(pointA) < 0) {
            uniqueCollisions.push(pointA);
        }

        if (uniqueCollisions.indexOf(pointB) < 0) {
            uniqueCollisions.push(pointB);
        }
    });

    return uniqueCollisions;
}

export function areaOfCollisions(data, index) {
    var collisionData;

    if (arguments.length === 1) {
        collisionData = collideAll(data);
    } else {
        collisionData = collidePoint(data, index);
    }

    var eachCollisionArea = collisionData.map(function(collision) {
        return areaOfIntersection(collision[0], collision[1]);
    });
    return d3.sum(eachCollisionArea);
}
