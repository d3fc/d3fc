window.slider = () => {
    let min = 100;
    let max = 100;
    let value = 50;
    let on = {
      change: () => {}
    };
  
    const lineJoin = fc.dataJoin('line', 'line');
    const handleJoin = fc.dataJoin('rect', 'handle');
    const labelJoin = fc.dataJoin('text', 'label');
  
    const slider = (selection) => {
      const size = selection.node().getBoundingClientRect();
      const textSize = 80;
      const data = [value];
      const sliderWidth = size.width - textSize;
  
      lineJoin(selection, data)
        .attr('x1', 0)
        .attr('x2', sliderWidth)
        .attr('y1', size.height / 2)
        .attr('y2', size.height / 2)
        .style('stroke', '#aaa');
  
      labelJoin(selection, data)
        .attr('x', size.width - 10)
        .attr('y', size.height / 2 + 5)
        .attr('text-anchor', 'end')
        .style('fill', '#888')
        .text(d => d);
  
      const moveToPosition = x => {
        const position = 100 * Math.floor((max / 100) * (x / sliderWidth));
        const newValue = Math.min(max, Math.max(min, position));
        if (value !== newValue) {
          value = newValue;
          slider(selection);
          on.change(value);
        }
      };
  
      const x = (value / max) * (size.width - textSize);
      const handleWidth = size.height - 8;
      handleJoin(selection, data)
        .attr('x', x - handleWidth / 2)
        .attr('y', 4)
        .attr('width', handleWidth)
        .attr('height', handleWidth)
        .style('stroke', '#888')
        .style('fill', '#eee')
        .style('cursor', 'pointer')
        .call(d3.drag().on('drag', () => moveToPosition(d3.event.x)));
  
      selection.on('click', () => moveToPosition(d3.event.x));
    };
  
    slider.on = (...args) => {
      if (args.length <= 1) {
          return on[args[0]];
      }
      on[args[0]] = args[1];
      return slider;
    };
  
    slider.min = (...args) => {
      if (!args.length) {
        return min;
      }
      min = args[0];
      return slider;
    };
  
    slider.max = (...args) => {
      if (!args.length) {
        return max;
      }
      max = args[0];
      return slider;
    };
  
    slider.value = (...args) => {
      if (!args.length) {
        return value;
      }
      value = args[0];
      return slider;
    };
  
    return slider;
  };
  