import { CartesianChart, Functor, CartesianChartConfigurationObject, Scale, Fallback } from "./cartesian";

export type CartesianBaseChart<XScale, YScale> = Omit<CartesianChart<XScale, YScale>, 'webglPlotArea' | 'canvasPlotArea' | 'svgPlotArea' | 'useDevicePixelRatio'> & {
    plotArea(): Functor<any>;
    plotArea(plotArea: any): CartesianBaseChart<XScale, YScale>;
}

export function CartesianBase<XScale extends Scale | undefined, YScale extends Scale | undefined>(configuration: CartesianChartConfigurationObject<XScale, YScale>)
    : CartesianBaseChart<Fallback<XScale>, Fallback<YScale>>;

export function CartesianBase<XScale extends Scale | undefined, YScale extends Scale | undefined>(xScale?: XScale, yScale?: YScale)
    : CartesianBaseChart<Fallback<XScale>, Fallback<YScale>>;

export type CartesianBase = typeof CartesianBase;

export { }