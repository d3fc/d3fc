import { sum } from 'd3-array';
import intersect from './intersect';

// computes the area of overlap between the rectangle with the given index with the
// rectangles in the array
export const collisionArea = (rectangles, index) =>  sum(
        rectangles.map((d, i) => (index === i) ? 0 : intersect(rectangles[index], d))
    );

// computes the total overlapping area of all of the rectangles in the given array
export const totalCollisionArea = (rectangles) => sum(
    rectangles.map((_, i) => collisionArea(rectangles, i))
);
