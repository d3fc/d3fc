import { CartesianChartArgs, CartesianChart, Functor } from './cartesian';

//TODO: Make this type more specific
type PlotArea = any;

export type CartesianBase<XScale, YScale> = Omit<CartesianChart<XScale, YScale>, 'webglPlotArea' | 'canvasPlotArea' | 'svgPlotArea' | 'useDevicePixelRatio'> & {
    plotArea(): Functor<PlotArea>;
    plotArea(plotArea: PlotArea): CartesianBase<XScale, YScale>;
}

export type CreateCartesianBase = <XScale, YScale>(...args: CartesianChartArgs<XScale, YScale>) => CartesianBase<XScale, YScale>

export default function CartesianBase(setPlotArea: any, defaultPlotArea: PlotArea): CreateCartesianBase
