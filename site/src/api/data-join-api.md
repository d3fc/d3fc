---
name: data-join-api
structure:
  - title: d3fc-data-join
    level: 1
    content: >+
      A component that simplifies the D3 data join and supports the d3fc
      decorate pattern.

  - title: Installation
    level: 1
    content: |
      ```bash
      npm install d3fc-data-join
      ```
  - title: API
    level: 1
    content: ''
    children:
      - title: General API
        level: 2
        content: >
          The data-join component is a relatively leightweight Wrapper around
          d3's selectAll/data data-join, which allows decoration of the result.
          This is achieved by appending the element to the enter selection
          before exposing it. A default transition of fade in/out is also
          implicitly added but can be modified.
      - title: Example usage
        level: 2
        content: >
          Here's a typical D3 data join that renders a list of animals:


          ```javascript

          var animals = ['Cat', 'Dog', 'Chicken'];


          a typical D3 data join, where

          var li = d3.select('ul')
            .selectAll('li.animal')
            .data(animals)
            .enter()
            .append('li')
            .attr('class', 'animal')
            .html(function(d) { return d; });
          ```


          Which yields the following:


          ```html

          <ul>
            <li>Cat</li>
            <li>Dog</li>
            <li>Chicken</li>
          </ul>

          ```


          And here's the equivalent using the data join component:


          ```javascript

          var join = fc.util.dataJoin()
              .selector('li.animal')
              .element('li')
              .attr('class', 'animal');

          var li = join(d3.select('ul'), animals);

          li.enter()
            .html(function(d) { return d; });
          ```


          Notice that the element has already been appended to, and had its
          attributes set, on the enter selection.
      - title: data join
        level: 2
        content: >
          *d3fc*.**dataJoin**()


          Constructs a new data join component instance.


          *dataJoin*.**selector**(*selector*)


          Set the selector used to add elements to the data join. This is
          equivalent to the selection provided to `selectAll` in the D3 data
          join pattern.


          *dataJoin*.**element**(*element*)


          The element to append to the enter selection.


          *dataJoin*.**attr**(*name*, *value*)


          *dataJoin*.**attr**(*attributes*)


          The attributes to see on the element appended to the enter selection.
          This can either be a *name* and a *value*, or an object.


          *dataJoin*.**key**(*keyFunc*)


          Specifies the key function used by the data join.
sidebarContents: []
layout: api
section: api
title: Data Join

---
