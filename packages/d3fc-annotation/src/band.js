import { scaleIdentity } from 'd3-scale';
import { select } from 'd3-selection';
import { dataJoin } from 'd3fc-data-join';
import { shapeBar } from 'd3fc-shape';
import { range } from './scale';
import constant from './constant';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let x0Value = () => {};
    let x1Value = () => {};
    let y0Value = () => {};
    let y1Value = () => {};
    let decorate = () => {};

    const join = dataJoin('g', 'annotation');

    const pathGenerator = shapeBar()
      .horizontalAlign('right')
      .verticalAlign('top')
      // a null value returned by a value accessor will be replaced by the scale's range
      .x((...args) => {
          const value = x0Value(...args);
          return value != null ? xScale(value) : range(xScale)[0];
      })
      .y((...args) => {
          const value = y0Value(...args);
          return value != null ? yScale(value) : range(yScale)[0];
      })
      .height((...args) => {
          const values = [y0Value(...args), y1Value(...args)];
          const scaleRange = range(yScale);
          return (values[1] != null ? values[1] : scaleRange[1]) - (values[0] != null ? values[0] : scaleRange[0]);
      })
      .width((...args) => {
          const values = [x0Value(...args), x1Value(...args)];
          const scaleRange = range(xScale);
          return (values[1] != null ? values[1] : scaleRange[1]) - (values[0] != null ? values[0] : scaleRange[0]);
      });

    var instance = (selection) => {

        selection.each((data, index, nodes) => {

            var g = join(select(nodes[index]), data);

            g.enter()
                .append('path')
                .classed('band', true);

            g.select('path')
                // the path generator is being used to render a single path, hence
                // an explicit index is provided
                .attr('d', (d, i) => pathGenerator([d], i));

            decorate(g, data, index);
        });
    };

    instance.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return instance;
    };
    instance.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return instance;
    };
    instance.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return instance;
    };
    instance.x0Value = (...args) => {
        if (!args.length) {
            return x0Value;
        }
        x0Value = constant(args[0]);
        return instance;
    };
    instance.x1Value = (...args) => {
        if (!args.length) {
            return x1Value;
        }
        x1Value = constant(args[0]);
        return instance;
    };
    instance.y0Value = (...args) => {
        if (!args.length) {
            return y0Value;
        }
        y0Value = constant(args[0]);
        return instance;
    };
    instance.y1Value = (...args) => {
        if (!args.length) {
            return y1Value;
        }
        y1Value = constant(args[0]);
        return instance;
    };

    return instance;
};
