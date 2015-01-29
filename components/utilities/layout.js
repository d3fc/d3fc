/* globals computeLayout */
(function(d3, fc) {
    'use strict';


    fc.utilities.layout = function() {

        // copied from the css-layout tests, tidies up the node structure.
        // this code will be removed long-term
        function fillNodes(node) {
            node.layout = {
                width: undefined,
                height: undefined,
                top: 0,
                left: 0
            };
            if (!node.style) {
                node.style = {};
            }
            if (!node.children || node.style.measure) {
                node.children = [];
            }
            node.children.forEach(fillNodes);
        }

        // parses the style attribute, converting it into a JavaScript object
        function parseStyle(style) {
            var properties = style.split(';');
            var json = {};
            properties.forEach(function(property) {
                var components = property.split(':');
                if (components.length === 2) {
                    var name = components[0].trim();
                    var value = components[1].trim();
                    json[name] = isNaN(value) ? value : Number(value);
                }
            });
            return json;
        }

        // creates the structure required by the layout engine
        function createLayout(el) {
            function getChildNodes() {
                var children = [];
                for (var i = 0; i < el.childElementCount; i++) {
                    var child = el.children[i];
                    if (child.getAttribute('data-style')) {
                        children.push(createLayout(child));
                    }
                }
                return children;
            }
            return {
                style: parseStyle(el.getAttribute('data-style')),
                children: getChildNodes(el),
                element: el
            };
        }

        // takes the result of layout and applied it to the SVG elements
        function applyLayout(node) {
            node.element.setAttribute('width', node.layout.width);
            node.element.setAttribute('height', node.layout.height);
            node.element.setAttribute('transform', 'translate(' + node.layout.left + ', ' + node.layout.top + ')');
            node.children.forEach(applyLayout);
        }

        var layout = function(selection) {
            selection.each(function(data) {
                var layoutNodes = createLayout(this);
                fillNodes(layoutNodes);
                computeLayout(layoutNodes);
                applyLayout(layoutNodes);
            });
        };
        return layout;
    };

}(d3, fc));