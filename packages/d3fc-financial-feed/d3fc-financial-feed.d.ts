declare namespace fc_financial_feed {

    export function Coinbase(): Coinbase;
    export function Quandl(): Quandl;

    interface CoinbaseDatum {
        date: Date,
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }

    interface Coinbase {
        product(): string;
        product(x: string): Coinbase;
        start(): Date;
        start(x: Date): Coinbase;
        end(): Date;
        end(x: Date): Coinbase;
        granularity(): number;
        granularity(x: number): Coinbase;

        (callback: (error: any, data?: CoinbaseDatum[]) => void);
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

        (callback: (error: any, data?: any[]) => void);
    }
}

declare module 'd3fc-financial-feed' {
    export = fc;
}
