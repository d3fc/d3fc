/**
 * Type definitions for @d3fc/d3fc-shape v5.0.8
 * 
 * Definitions by: Hanna Greaves <https://github.com/hanna-greaves>
 * Typescript version 3.5
 */

/**
 *  Functors used to provide number returning functions to shape drawing routines 
 */
export type Functor = (datum: CandlestickData, index?: number) => number

/**
 *  Parameter type to be provided to shapes, such as candlestick width
 */
export type FunctorParameter = number | Functor

/**
 * Data required to render a single candlestick chart
 * 
 * ToDo: Are these really optional pieces of data?
 */
export interface CandlestickData {
    /** The X Location of the candlestick  */
    x?: number

    /** The open value of the real body */
    open?: number

    /** The close value of the real body */
    close?: number

    /** The top of the upper shadow */
    high?: number

    /** The bottom of the lower shadow */
    low?: number

    /** The width in pixels of the chart */
    width?: number
}

/**
 * A candlestick chart datapoint. Used to describe price movements of a security, derivative, or currency.
 * 
 * Operations performed on a candlestick return an updated candlestick
 * 
 * @see CandlestickData
 */
export interface Candlestick {
    context(context: CanvasRenderingContext2D) : Candlestick;
    x(value: FunctorParameter) : Candlestick;
    open(value: FunctorParameter) : Candlestick;
    high(value: FunctorParameter) : Candlestick;
    low(value: FunctorParameter) : Candlestick;
    close(value: FunctorParameter) : Candlestick;
    width(value: FunctorParameter) : Candlestick;

    (data: CandlestickData[]): void;
}

/**
 * Creates a candlestick
 */
export const Candlestick: (data?: CandlestickData) => Candlestick;
