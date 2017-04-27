// determines the offset required along the cross scale based
// on the series alignment
export default (align, width) => {
    switch (align) {
    case 'left':
        return width / 2;
    case 'right':
        return -width / 2;
    default:
        return 0;
    }
};
