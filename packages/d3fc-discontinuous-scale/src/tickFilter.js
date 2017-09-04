export default function tickFilter(ticks, discontinuityProvider) {
    const discontinuousTicks = [];
    for (const tick of ticks) {
        const up = discontinuityProvider.clampUp(tick);
        const down = discontinuityProvider.clampDown(tick);
        if (up === down) {
            discontinuousTicks.push(up);
        }
    }
    return discontinuousTicks;
}
