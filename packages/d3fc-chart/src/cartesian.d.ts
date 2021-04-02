import { TStore } from './store'

type Functor<T> = ((...args: any[]) => T);
type TypeOrFunctor<T> = T | Functor<T>;

type XOrient = 'top' | 'bottom' | 'none';
type YOrient = 'left' | 'right' | 'none';

type WebglSeries = any; // Todo: Replace with import from d3fc-series
type CanvasSeries = any; // Todo: Replace with import from d3fc-series
type SVGSeries = any; // Todo: Replace with import from d3fc-series
type DataJoin = any; // Todo: External 

type Decorator = (container: DataJoin, data: any, index: number) => void

type XAxisStore = TStore<'xTickFormat' | 'xTicks' | 'xTickArguments' | 'xTickSize' | 'xTickSizeInner' | 'xTickSizeOuter' | 'xTickValues' | 'xTickPadding' | 'xTickCenterLabel'>;
type YAxisStore = TStore<'yTickFormat' | 'yTicks' | 'yTickArguments' | 'yTickSize' | 'yTickSizeInner' | 'yTickSizeOuter' | 'yTickValues' | 'yTickPadding' | 'yTickCenterLabel'>;


// Todo: Something more specific with scale?
type Scale = {
    range: any,
    domain: any
};

type PrefixScale<Scale, Prefix extends string> = {
    [Property in keyof Scale as `${Prefix}${Capitalize<string & Property>}`]: Scale[Property]
}

type Axis = any; // Todo: More specific with scale?

export type CartesianChartArgs = [xScale: Scale, yScale?: Scale] | [{
    xScale?: Scale,
    yScale?: Scale,
    xAxis: {
        [key in XOrient]: Axis
    },
    yAxis: {
        [key in YOrient]: Axis
    }
}]


export default function Cartesian(...args: CartesianChartArgs): {
    (selection: any): void;

    xOrient(): Functor<XOrient>;
    xOrient(orient: XOrient): typeof Cartesian;

    yOrient(): Functor<YOrient>;
    yOrient(orient: YOrient): typeof Cartesian;

    xDecorate(): Decorator;
    xDecorate(decorate: Decorator): typeof Cartesian;

    yDecorate(): Decorator;
    yDecorate(decorate: Decorator): typeof Cartesian;

    chartLabel(): Functor<string>;
    chartLabel(label: TypeOrFunctor<string>): typeof Cartesian;

    xLabel(): Functor<string>;
    xLabel(label: TypeOrFunctor<string>): typeof Cartesian;

    yLabel(): Functor<string>;
    yLabel(label: TypeOrFunctor<string>): typeof Cartesian;

    xAxisHeight(): Functor<string>;
    xAxisHeight(height: TypeOrFunctor<string>): typeof Cartesian;

    yAxisWidth(): Functor<string>;
    yAxisWidth(height: TypeOrFunctor<string>): typeof Cartesian;

    webglPlotArea(): WebglSeries;
    webglPlotArea(plotArea: WebglSeries): typeof Cartesian;

    canvasPlotArea(): CanvasSeries;
    canvasPlotArea(plotArea: CanvasSeries): typeof Cartesian;

    svgPlotArea(): SVGSeries;
    svgPlotArea(plotArea: SVGSeries): typeof Cartesian;

    decorate(): Decorator;
    decorate(decorate: Decorator): typeof Cartesian;

    useDevicePixelRatio(): boolean;
    useDevicePixelRatio(useDevicePixelRatio: boolean): typeof Cartesian;
}
    & XAxisStore
    & YAxisStore
    & PrefixScale<Scale, 'x'>
    & PrefixScale<Scale, 'y'>
