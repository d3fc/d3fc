export function skipWeekends() {
    return function(date) {
        var day = date.getDay();
        return !(day === 0 || day === 6);
    };
}
