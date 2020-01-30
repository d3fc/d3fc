export default () => {
    let cachedArray = new Float32Array(0);

    return requiredLength => {
        if (cachedArray.length > requiredLength) {
            cachedArray = new Float32Array(
                cachedArray.buffer,
                0,
                requiredLength
            );
        } else if (cachedArray !== requiredLength) {
            cachedArray = new Float32Array(requiredLength);
        }
        return cachedArray;
    };
};
