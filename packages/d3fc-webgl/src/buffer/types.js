const types = {
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    FLOAT: 5126
};

export default types;

export function length(type) {
    switch (type) {
        case types.BYTE:
        case types.UNSIGNED_BYTE:
            return 1;
        case types.SHORT:
        case types.UNSIGNED_SHORT:
            return 2;
        case types.FLOAT:
            return 4;
        default:
            throw new Error(`Unknown type ${type}`);
    }
}

export function getArrayViewConstructor(type) {
    switch (type) {
        case types.BYTE:
            return Int8Array;
        case types.UNSIGNED_BYTE:
            return Uint8Array;
        case types.SHORT:
            return Int16Array;
        case types.UNSIGNED_SHORT:
            return Uint16Array;
        case types.FLOAT:
            return Float32Array;
        default:
            throw new Error(`Unknown type ${type}`);
    }
}
