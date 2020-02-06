import types from './types';

export default type => {
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
};
