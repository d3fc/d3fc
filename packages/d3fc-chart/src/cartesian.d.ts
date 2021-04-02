type Functor<T> = ((...args: any[]) => T);
type TypeOrFunctor<T> = T | Functor<T>;

type XOrient = 'top' | 'bottom' | 'none';
type YOrient = 'left' | 'right' | 'none';

type WebglSeries = any; // Todo: Replace with import from d3fc-series
type CanvasSeries = any; // Todo: Replace with import from d3fc-series
type SVGSeries = any; // Todo: Replace with import from d3fc-series
type DataJoin = any; // Todo: External 

type Decorator = (container: DataJoin, data: any, index: number) => void

declare function Cartesian(...args: any[]): {
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
};

export default Cartesian;
