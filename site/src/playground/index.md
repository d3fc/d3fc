---
layout: default
title: Playground Gallery
parts:
  - namespace: series
    label: Chart Types
  - namespace: indicator
    label: Financial Indicators
---
<div class="previews container" id="main">
    <div class="row">
        <h1>
            d3fc Playground
            <small>
            click on a box to open it as an editable example
            </small>
        </h1>
    </div>

    {{#each page.parts}}
    <div class="row">
        <h2>{{this.label}}</h2>
    </div>
    <div class="row">
    {{#each ../tags}}
      {{#is tag "playground"}}
        {{#each pages}}
          {{#is data.namespace ../../../this.namespace}}
        <div class="col-sm-4 preview">
            <a href="playground.html?example={{replace (replace this.relativeLink '../../' '') '.html' ''}}">
                <div id="{{>component-id data.component}}" class="chart-small">
{{{data.example-fixture}}}
                    <div class="caption">
                        <h4>{{data.title}}</h4>
                    </div>
                </div>
            </a>
        </div>
        <script type="text/javascript">
(function() {
var f = createFixture('#{{>component-id data.component}}', 800, null, null, function() { return true; });
var container = f.container, data = f.data
xScale = f.xScale, yScale = f.yScale,
height = f.dimensions.height, width = f.dimensions.width;
{{{data.example-code}}}
}());
        </script>          
          {{/is}}
        {{/each}}
      {{/is}}
    {{/each}}
    </div>
    {{/each}}
</div>
