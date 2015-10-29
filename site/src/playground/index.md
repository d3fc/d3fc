---
layout: default
title: Playground Gallery
---
<div class="previews container">
  <div class="row">
    {{#each tags}}
      {{#is tag "playground"}}
        {{#each pages}}
          <div class="col-sm-4">
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
        {{/each}}
      {{/is}}
    {{/each}}
  </div>
</div>
