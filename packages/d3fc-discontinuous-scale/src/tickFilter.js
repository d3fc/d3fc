export default function tickFilter(ticks, scale, domain) {
    const scaledTicks = ticks.map(tick => [scale(tick), tick]);

    const valueOf = datum => (datum instanceof Date) ? datum.getTime() : datum;

    const uniqueTicks = scaledTicks.reduce(function(arr, tick) {
        if (arr.filter(function(f) { return valueOf(f[0]) === valueOf(tick[0]); }).length === 0) {
            arr.push(tick);
        }
        return arr;
    }, []);
    return uniqueTicks.map(t => t[1]);
}
