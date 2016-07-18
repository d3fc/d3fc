const getPlacement = (x, y, width, height, location) => ({
    x,
    y,
    width,
    height,
    location
});

// returns all the potential placements of the given label
export default (label) => {
    const x = label.x;
    const y = label.y;
    const width = label.width;
    const height = label.height;
    return [
        getPlacement(x, y, width, height, 'bottom-right'),
        getPlacement(x - width, y, width, height, 'bottom-left'),
        getPlacement(x - width, y - height, width, height, 'top-left'),
        getPlacement(x, y - height, width, height, 'top-right'),
        getPlacement(x, y - height / 2, width, height, 'middle-right'),
        getPlacement(x - width / 2, y, width, height, 'bottom-center'),
        getPlacement(x - width, y - height / 2, width, height, 'middle-left'),
        getPlacement(x - width / 2, y - height, width, height, 'top-center')
    ];
};
