---
layout: example
title: Examples
---

d3fc provides the building block that you can use to construct complex and highly customised charts. This page shows a number of examples ranging from the simple (for example a [scatter](/examples/scatter), or [bubble](/examples/bubble) chart) to the highly complex, for example a [3D chart with SVG filters](/examples/basecoin)!

<div class="row">
  {{#each pages}}
    {{#if example }}
      <div class="col-sm-6 col-md-4">
        <a href="{{page.destination}}" class="thumbnail">
          <img src="/{{page.dirname}}/thumbnail.png" alt="{{page.title}}">
        </a>
      </div>
    {{/if}}
  {{/each}}
</div>
