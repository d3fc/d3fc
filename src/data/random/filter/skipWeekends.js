export function skipWeekends() {
    return function(datum) {
        var day = datum.date.getDay();
        return !(day === 0 || day === 6);
    };
}
