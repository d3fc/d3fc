import ohlcBase from './ohlcBase';
import { webglSeriesOhlc } from '@d3fc/d3fc-webgl';

export default () => ohlcBase(webglSeriesOhlc());
