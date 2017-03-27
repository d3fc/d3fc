---
layout: example
title: Examples
example: true
blocks:
  - user: ColinEberhardt
    block: 7396acc69f9a061fe58b562c6220a08c
    title: Line / Area Chart
  - user: ColinEberhardt
    block: ab7805a9a7af9717e86adc1656fa98d9
    title: Streaming Financial Chart
  - user: ColinEberhardt
    block: 493ed4a0c186e9cfe88afacbe2a16fe2
    title: Stacked Bar Chart
  - user: ColinEberhardt
    block: 4676df62ce9cad924e8bc7d492fb602e
    title: Grouped Bar Chart
  - user: ColinEberhardt
    block: 7afb58d94428c28c960d243b5299f4d4
    title: Simple Crosshair Example
  - user: ColinEberhardt
    block: b242f12db096ff836526c0cd1246e7f3
    title: Heath and Wealth of Nations - Bubble Chart
  - user: ColinEberhardt
    block: 31b0f724a795ad3fd33041cb62bb1038
    title: London Marathon 2016 Pacing vs. Finish Time
  - user: ColinEberhardt
    block: 32b0782562f83566fa82d2a4f2a2543f
    title: Weekly mileage vs. Marathon training plans - Small Multiples
  - user: ColinEberhardt
    block: dea5ae59475675e87d765b3a4a8dc057
    title: Small Multiples
  - user: ColinEberhardt
    block: bdf2fb1ac3cfb9b388cfe6c876758a90
    title: Average weekly training mileage - vs - Finish time
  - user: ColinEberhardt
    block: 66ae2df764efe8448b9b12c0c699f5b5
    title: London Marathon Weekly Training Mileage
  - user: ColinEberhardt
    block: d94b5f8c39d634fec2944a42666604e1
    title: London Marathon Finish Time Distribution
  - user: ColinEberhardt
    block: f84c5ded602e0455d248ca889b75b0da
    title: Batch Rendering of 53k Datapoints
  - user: ColinEberhardt
    block: 8845df1f2c6b496148eb4e3b02c238ac
    title: Let's Make a Bar Chart - Decorate Example
  - user: ColinEberhardt
    block: 389c76c6a544af9f0cab
    title: d3fc-label-layout map example
  - user: ColinEberhardt
    block: ab37d7973bfe32feea8cad21bd40fe1a
    title: Let's Make a Bar Chart - Canvas Version
  - user: ColinEberhardt
    block: de9c652b7e820bd7b51d2b966e796ff5
    title: Canvas Chart Zoom



---

You can find a diverse range of examples, hosted on the D3 bl.ocks.org website. Want to add an example of your own? Why
not raise an issue, and we'll get it added.

Most of these bl.ocks were created using the interactive [Bl.ock Builder](http://blockbuilder.org/) tool.

<div class='gists'>
  {{#each blocks}}
    <div class='gist col-md-4 col-xs-6'>
      <a href='https://bl.ocks.org/{{{ user }}}/{{{ block }}}'
        style='background-image: url("https://gist.githubusercontent.com/{{{ user }}}/{{{ block }}}/raw/thumbnail.png")'/>
        <div class='title'>{{{ title }}}</div>
      </a>
    </div>
  {{/each}}
</div>
