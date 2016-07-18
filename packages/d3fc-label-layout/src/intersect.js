const isIntersecting = (a, b) =>
    !(a.x >= (b.x + b.width) ||
       (a.x + a.width) <= b.x ||
       a.y >= (b.y + b.height) ||
       (a.y + a.height) <= b.y);

export default (a, b) => {
    if (isIntersecting(a, b)) {
        const left = Math.max(a.x, b.x);
        const right = Math.min(a.x + a.width, b.x + b.width);
        const top = Math.max(a.y, b.y);
        const bottom = Math.min(a.y + a.height, b.y + b.height);
        return (right - left) * (bottom - top);
    } else {
        return 0;
    }
};
