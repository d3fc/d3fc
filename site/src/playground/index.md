---
layout: default
title: Playground Gallery
parts:
  - namespace: series
    label: Series Types
  - namespace: indicator
    label: Financial Indicators
  - namespace: examples
    label: More Complex Examples
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
            {{#is data.namespace 'examples'}}
            <div class="chart-small">
            <a href="playground.html?example={{replace (replace this.relativeLink '../' 'examples/') '.html' ''}}" class="thumbnail">
              <img src="{{replace (replace this.relativeLink '../' '../examples/') 'index.html' 'thumbnail.png'}}" alt="Stacked Bar">
              <div class="caption">
                  <h4>{{data.title}}</h4>
              </div>
              </a>
            </div>
            {{else}}
            <a href="playground.html?example={{replace (replace this.relativeLink '../../' '') '.html' ''}}">
                <div id="{{>component-id data.component}}" class="chart-small">
{{{data.example-fixture}}}
                    <div class="caption">
                        <h4>{{data.title}}</h4>
                    </div>
                </div>
            </a>
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
        </div>
          {{/is}}
        {{/each}}
      {{/is}}
    {{/each}}
    </div>
    {{/each}}
</div>
