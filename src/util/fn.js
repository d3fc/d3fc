export function context() {
    return this;
}

export function identity(d) {
    return d;
}

export function index(d, i) {
    return i;
}

export function noop(d) {}

// Checks that passes properties are 'defined', meaning that calling them with (d, i) returns non null values
export function defined() {
    var outerArguments = arguments;
    return function(d, i) {
        for (var c = 0, j = outerArguments.length; c < j; c++) {
            if (outerArguments[c](d, i) == null) {
                return false;
            }
        }
        return true;
    };
}
