// Checks that passed properties are 'defined', meaning that calling them with (d, i) returns non null values
export default function defined() {
    const outerArguments = arguments;
    return function(d, i) {
        for (let c = 0, j = outerArguments.length; c < j; c++) {
            if (outerArguments[c](d, i) == null) {
                return false;
            }
        }
        return true;
    };
}
