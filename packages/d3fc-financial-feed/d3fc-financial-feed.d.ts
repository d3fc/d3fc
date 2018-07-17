declare namespace fc_financial_feed {

    export function Gdax(): Gdax;
    export function Quandl(): Quandl;

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

    interface Quandl {
        database(): string;
        database(x: string): Quandl;
        dataset(): string;
        dataset(x: string): Quandl;
        apiKey(): string;
        apiKey(x: string): Quandl;
        start(): Date;
        start(x: Date): Quandl;
        end(): Date;
        end(x: Date): Quandl;
        rows(): number;
        rows(x: number): Quandl;
        descending(): boolean;
        descending(x: boolean): Quandl;
        collapse(): string;
        collapse(x: string): Quandl;
        columnNameMap(): (name: string) => string;
        columnNameMap(mapFunction: (name: string) => string): Quandl;
        defaultColumnNameMap: (name: string) => string;

        (): Promise<any[]>;
    }
}

declare module 'd3fc-financial-feed' {
    export = fc;
}
