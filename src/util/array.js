export function randomItem(array) {
    return array[randomIndex(array)];
}

export function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

export function cloneAndReplace(array, index, replacement) {
    var clone = array.slice();
    clone[index] = replacement;
    return clone;
}
