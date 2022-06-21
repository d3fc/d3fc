class Annotation {
    constructor(value, velocity) {
        this.value = value;
        this.velocity = velocity;
    }

    animate() {
        this.velocity += (Math.random() - 0.5) * 0.01;
        this.value += this.velocity;
        const [min, max] = scale.domain();
        if (this.value < min) {
            this.value = min + (min - this.value);
            this.velocity *= -1;
        }
        if (this.value > max) {
            this.value = max + (max - this.value);
            this.velocity *= -1;
        }
    }

    valueOf() {
        return this.value;
    }
}

// Using a value wrapper prevents the identity-based data
// join within axis churning DOM nodes. If your annotation
// does not change value, there is no need for the wrapper.
const annotation = new Annotation(45, 0.01);

const scale = d3.scaleLinear().domain([0, 100]);

const axis = fc
    .axisBottom(scale)
    .tickValues([...scale.ticks(), annotation])
    .decorate(g => {
        g.filter(d => d === annotation)
            .select('path')
            .attr('d', 'M0,0 l-10,10 l0,10 l20,0 l0,-10 Z')
            .style('fill', 'rgba(200, 200, 200, 0.8)')
            .style('stroke', 'none');
    });

const container = document.querySelector('#axis-container');

d3.select(container)
    .on('draw', () => {
        d3.select(container)
            .select('svg')
            .call(axis);
    })
    .on('measure', event => {
        const { width } = event.detail;
        scale.range([0, width]);
    });

container.requestRedraw();

setInterval(() => {
    annotation.animate();
    container.requestRedraw();
}, 1);
