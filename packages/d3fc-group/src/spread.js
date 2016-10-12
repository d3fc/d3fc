export default () => {

    let key = '';
    let orient = 'vertical';
    // D3 CSV returns all values as strings, this converts them to numbers
    // by default.
    let cellValue = (row, column) => Number(row[column]);

    const verticalSpread = (data) =>
        Object.keys(data[0])
            .filter(k => k !== key)
            .map((k) => {
                const values = data.filter(row => row[k])
                    .map((row) => ({
                        x: row[key],
                        y: cellValue(row, k)
                    }));
                return {
                    key: k,
                    values: values
                };
            });

    const horizontalSpread = (data) =>
        data.map((row) => ({
            key: row[key],
            values: Object.keys(row)
                .filter((d) => d !== key)
                .map((k) => ({
                    x: k,
                    y: cellValue(row, k)
                }))
        }));

    const spread = (data) =>
        orient === 'vertical' ? verticalSpread(data) : horizontalSpread(data);

    spread.key = (...args) => {
        if (!args.length) {
            return key;
        }
        key = args[0];
        return spread;
    };

    spread.cellValue = (...args) => {
        if (!args.length) {
            return cellValue;
        }
        cellValue = args[0];
        return spread;
    };

    spread.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return spread;
    };

    return spread;
};
