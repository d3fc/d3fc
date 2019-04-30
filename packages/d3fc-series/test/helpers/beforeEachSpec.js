import jsdom from 'jsdom';
import { select } from 'd3-selection';
global.document = jsdom.jsdom();
global.d3 = { select };
