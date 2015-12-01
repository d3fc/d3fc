export function getAllPlacements(label) {
    var x = label.x;
    var y = label.y;
    var width = label.width;
    var height = label.height;
    return [
        getPlacement(x, y, width, height), // Same location
        getPlacement(x - width, y, width, height), // Left
        getPlacement(x - width, y - height, width, height), // Up, left
        getPlacement(x, y - height, width, height), // Up
        getPlacement(x, y - height / 2, width, height), // Half up
        getPlacement(x - width / 2, y, width, height), // Half left
        getPlacement(x - width, y - height / 2, width, height), // Full left, half up
        getPlacement(x - width / 2, y - height, width, height) // Full up, half left
    ];
}

export function getPlacement(x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height
    };
}
