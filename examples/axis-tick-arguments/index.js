const container = document.querySelector('d3fc-svg');

const scale = d3.scaleLinear().domain([0, 10000]);

d3.select(container)
    .on('draw', () => {
        const svg = d3.select(container).select('svg');

        svg.append('g')
            .attr('transform', 'translate(0, 20)')
            .call(
                d3
                    .axisBottom(scale)
                    .tickPadding(2)
                    .ticks(5, 's')
            );
        svg.append('g')
            .attr('transform', 'translate(0, 50)')
            .call(
                fc
                    .axisBottom(scale)
                    .tickPadding(2)
                    .ticks(5, 's')
            );

        svg.append('g')
            .attr('transform', 'translate(0, 80)')
            .call(
                d3
                    .axisBottom(scale)
                    .tickSizeInner(2)
                    .tickArguments([20, 's'])
            );
        svg.append('g')
            .attr('transform', 'translate(0, 110)')
            .call(
                fc
                    .axisBottom(scale)
                    .tickSizeInner(2)
                    .tickArguments([20, 's'])
            );

        svg.append('g')
            .attr('transform', 'translate(0, 140)')
            .call(d3.axisBottom(scale).tickFormat(d3.format(',.0f')));
        svg.append('g')
            .attr('transform', 'translate(0, 170)')
            .call(fc.axisBottom(scale).tickFormat(d3.format(',.0f')));
    })
    .on('measure', () => {
        const { width } = event.detail;
        scale.range([0, width]);
    });

container.requestRedraw();
