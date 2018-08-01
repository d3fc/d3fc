import ohlcBase from './ohlcBase';
import { shapeOhlc } from '@d3fc/d3fc-shape';

export default () => ohlcBase(shapeOhlc(), 'ohlc');
