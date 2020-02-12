import ohlcBase from './ohlcBase';
import { webglSeriesCandlestick } from '@d3fc/d3fc-webgl';

export default () => ohlcBase(webglSeriesCandlestick());
