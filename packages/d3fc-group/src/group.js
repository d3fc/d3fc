export default () => {

    let key = '';
    let orient = 'vertical';
    // D3 CSV returns all values as strings, this converts them to numbers
    // by default.
    let value = (row, column) => Number(row[column]);

    const verticalgroup = (data) =>
        Object.keys(data[0])
            .filter(k => k !== key)
            .map((k) => {
                const values = data.filter(row => row[k])
                    .map((row) => {
                        const cell = [row[key], value(row, k)];
                        cell.data = row;
                        return cell;
                    });
                values.key = k;
                return values;
            });

    const horizontalgroup = (data) =>
        data.map((row) => {
            const values = Object.keys(row)
                .filter((d) => d !== key)
                .map((k) => {
                    const cell = [k, value(row, k)];
                    cell.data = row;
                    return cell;
                });
            values.key = row[key];
            return values;
        });

    const group = (data) =>
        orient === 'vertical' ? verticalgroup(data) : horizontalgroup(data);

    group.key = (...args) => {
        if (!args.length) {
            return key;
        }
        key = args[0];
        return group;
    };

    group.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return group;
    };

    group.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return group;
    };

    return group;
};
