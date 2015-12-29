// Checks that passes properties are 'defined', meaning that calling them with d, i returns non null values
export default function(d, i) {
    for (var c = 0, j = arguments.length; c < j; c++) {
        if (arguments[c] !== d && arguments[c] !== i) {
            if (arguments[c](d, i) === null) {
                return false;
            }
        }
    }
    return true;
}
