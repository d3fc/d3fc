export default function tickFilter(ticks, discontinuityProvider) {
    const discontinuousTicks = ticks.map(discontinuityProvider.clampUp);
    if (
        discontinuousTicks.length !==
        new Set(discontinuousTicks.map(d => d?.valueOf())).size
    ) {
        console.warn(
            'There are multiple ticks that fall within a discontinuity, which has led to them being rendered on top of each other. Consider using scale.ticks to explicitly specify the ticks for the scale.'
        );
    }
    return discontinuousTicks;
}
