import ohlcBase from './ohlcBase';
import { glCandlestick } from '@d3fc/d3fc-webgl';

export default () => ohlcBase(glCandlestick());
