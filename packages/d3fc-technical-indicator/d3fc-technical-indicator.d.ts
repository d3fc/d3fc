declare namespace fc {

    // BOLLINGER
    export function indicatorBollingerBands(): BollingerBands<number>;
    export function indicatorBollingerBands<T>(): BollingerBands<T>;

    interface BollingerBandsDatum {
        upper: number,
        average: number;
        lower: number;
    }

    interface BollingerBands<T> {
        value(): (datum: T, index: number) => number;
        value(accessor: (datum: T, index: number) => number): BollingerBands<T>;

        period(): number;
        period(x: number): BollingerBands<T>;

        multiplier(): number;
        multiplier(x: number): BollingerBands<T>;

        (data: T[]): BollingerBandsDatum[];
    }

    // ELDER-RAY
    export function indicatorElderRay(): ElderRay<number>;
    export function indicatorElderRay<T>(): ElderRay<T>;

    interface ElderRayDatum {
        bullPower: number;
        bearPower: number;
    }

    interface ElderRay<T> {
        closeValue(): (datum: T, index: number) => number;
        closeValue(accessor: (datum: T, index: number) => number): ElderRay<T>;

        highValue(): (datum: T) => number;
        highValue(accessor: (datum: T) => number): ElderRay<T>;

        lowValue(): (datum: T) => number;
        lowValue(accessor: (datum: T) => number): ElderRay<T>;

        period(): (data: T[]) => number;
        period(x: (data: T[]) => number): ElderRay<T>;
        period(x: number): ElderRay<T>;

        (data: T[]): ElderRayDatum[];
    }

    // ENVELOPE
    export function indicatorEnvelope(): Envelope<number>;
    export function indicatorEnvelope<T>(): Envelope<T>;

    interface EnvelopeDatum {
        upper: number;
        lower: number;
    }

    interface Envelope<T> {
        value(): (datum: T) => number;
        value(accessor: (datum: T) => number): Envelope<T>;

        factor(): number;
        factor(x: number): Envelope<T>;

        (data: T[]): EnvelopeDatum[];
    }

    // MOVING AVERAGE
    export function indicatorMovingAverage(): MovingAverage<number>;
    export function indicatorMovingAverage<T>(): MovingAverage<T>;

    interface MovingAverage<T> {
        value(): (datum: T, index: number) => number;
        value(accessor: (datum: T, index: number) => number): MovingAverage<T>;

        period(): (data: T[]) => number;
        period(x: (data: T[]) => number): MovingAverage<T>;
        period(x: number): MovingAverage<T>;

        (data: T[]): number[];
    }

    // EXPONENTIAL MOVING AVERAGE
    export function indicatorExponentialMovingAverage(): ExponentialMovingAverage<number>;
    export function indicatorExponentialMovingAverage<T>(): ExponentialMovingAverage<T>;

    interface ExponentialMovingAverage<T> {
        value(): (datum: T, index: number) => number;
        value(accessor: (datum: T, index: number) => number): ExponentialMovingAverage<T>;

        period(): (data: T[]) => number;
        period(x: (data: T[]) => number): ExponentialMovingAverage<T>;
        period(x: number): ExponentialMovingAverage<T>;

        (data: T[]): number[];
    }

    // FORCE INDEX
    export function indicatorForceIndex(): ForceIndex<number>;
    export function indicatorForceIndex<T>(): ForceIndex<T>;

    interface ForceIndex<T> {
        closeValue(): (datum: T) => number;
        closeValue(accessor: (datum: T) => number): ForceIndex<T>;

        volumeValue(): (datum: T) => number;
        volumeValue(accessor: (datum: T) => number): ForceIndex<T>;

        period(): (data: T[]) => number;
        period(x: (data: T[]) => number): ForceIndex<T>;
        period(x: number): ForceIndex<T>;

        (data: T[]): number[];
    }

    // MACD
    export function indicatorMacd(): MACD<number>;
    export function indicatorMacd<T>(): MACD<T>;

    interface MacdDatum {
        macd: number;
        signal: number;
        divergence: number;
    }

    interface MACD<T> {
        value(): (datum: T, index: number) => number;
        value(accessor: (datum: T, index: number) => number): MACD<T>;

        fastPeriod(): (data: T[]) => number;
        fastPeriod(x: (data: T[]) => number): MACD<T>;
        fastPeriod(x: number): MACD<T>;

        slowPeriod(): (data: T[]) => number;
        slowPeriod(x: (data: T[]) => number): MACD<T>;
        slowPeriod(x: number): MACD<T>;

        signalPeriod(): (data: T[]) => number;
        signalPeriod(x: (data: T[]) => number): MACD<T>;
        signalPeriod(x: number): MACD<T>;

        (data: T[]): MacdDatum[];
    }

    // RELATIVE STRENGTH INDEX
    export function indicatorRelativeStrengthIndex(): RSI<number>;
    export function indicatorRelativeStrengthIndex<T>(): RSI<T>;

    interface RSI<T> {
        value(): (datum: T, index: number) => number;
        value(accessor: (datum: T, index: number) => number): RSI<T>;

        period(): (data: T[]) => number;
        period(x: (data: T[]) => number): RSI<T>;
        period(x: number): RSI<T>;

        (data: T[]): number[];
    }

    // STOCHASTIC OSCILLATOR
    export function indicatorStochasticOscillator(): StochasticOscillator<number>;
    export function indicatorStochasticOscillator<T>(): StochasticOscillator<T>;

    interface StochasticOscillator<T> {
        closeValue(): (datum: T) => number;
        closeValue(accessor: (datum: T) => number): StochasticOscillator<T>;

        highValue(): (datum: T) => number;
        highValue(accessor: (datum: T) => number): StochasticOscillator<T>;

        lowValue(): (datum: T) => number;
        lowValue(accessor: (datum: T) => number): StochasticOscillator<T>;

        kPeriod(): (data: T[]) => number;
        kPeriod(x: (data: T[]) => number): StochasticOscillator<T>;
        kPeriod(x: number): StochasticOscillator<T>;

        dPeriod(): (data: T[]) => number;
        dPeriod(x: (data: T[]) => number): StochasticOscillator<T>;
        dPeriod(x: number): StochasticOscillator<T>;

        (data: T[]): number[];
    }

}

declare module 'd3fc-technical-indicator' {
    export = fc;
}
