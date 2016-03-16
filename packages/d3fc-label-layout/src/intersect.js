const isIntersecting = (a, b) =>
    !(a.x >= (b.x + b.width) ||
       (a.x + a.width) <= b.x ||
       a.y >= (b.y + b.height) ||
       (a.y + a.height) <= b.y);

export default (a, b) => {
    if (isIntersecting(a, b)) {
        var left = Math.max(a.x, b.x);
        var right = Math.min(a.x + a.width, b.x + b.width);
        var top = Math.max(a.y, b.y);
        var bottom = Math.min(a.y + a.height, b.y + b.height);
        return (right - left) * (bottom - top);
    } else {
        return 0;
    }
};
