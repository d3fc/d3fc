declare namespace fc_financial_feed {

    export function Gdax(): Gdax;

    interface GdaxDatum {
        date: Date,
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }

    interface Gdax {
        product(): string;
        product(x: string): Gdax;
        start(): Date;
        start(x: Date): Gdax;
        end(): Date;
        end(x: Date): Gdax;
        granularity(): number;
        granularity(x: number): Gdax;

        (): Promise<GdaxDatum[]>;
    }
}

declare module 'd3fc-financial-feed' {
    export = fc;
}
