const types = {
    FLOAT: 5126
};

export default types;

export function length(type) {
    switch (type) {
        case types.FLOAT:
            return 4;
        default:
            throw new Error(`Unknown type ${type}`);
    }
}
