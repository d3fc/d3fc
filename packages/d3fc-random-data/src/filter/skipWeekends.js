export default function(datum) {
    const day = datum.date.getDay();
    return !(day === 0 || day === 6);
}
