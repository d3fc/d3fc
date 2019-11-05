import ohlcBase from './ohlcBase';
import { glOhlc } from '@d3fc/d3fc-webgl';

export default () => ohlcBase(glOhlc());
