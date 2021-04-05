import { CartesianChartArgs, CartesianChart, Functor } from './cartesian';

type PlotArea = any;

export type CartesianBase<XScale, YScale> = Omit<CartesianChart<XScale, YScale>, 'webglPlotArea' | 'canvasPlotArea' | 'svgPlotArea' | 'useDevicePixelRatio'> & {
    plotArea(): Functor<PlotArea>;
    plotArea(plotArea: PlotArea): CartesianBase<XScale, YScale>;
}

export default function CartesianBase(setPlotArea: any, defaultPlotArea: PlotArea): <XScale, YScale>(...args: CartesianChartArgs<XScale, YScale>) =>
    CartesianBase<XScale, YScale>
