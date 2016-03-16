import d3 from 'd3';
import intersect from '../intersect';

// computes the area of overlap between the rectangle with the given index with the
// rectangles in the array
export const collisionArea = (rectangles, index) =>  d3.sum(
        rectangles.filter((_, i) => index !== i)
            .map((d) => intersect(rectangles[index], d))
    );

// computes the total overlapping area of all of the rectangles in the given array
export const totalCollisionArea = (rectangles) => d3.sum(
    rectangles.map((_, i) => collisionArea(rectangles, i))
);
