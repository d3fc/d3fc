/* globals computeLayout */
(function(d3, fc) {
    'use strict';


    d3.selection.prototype.layout = function(name, value) {
        var n = arguments.length;
        if (n === 2) {
            this.attr('layout-css', name + ':' + value);
        } else if (n === 1) {
            if (typeof name !== 'string') {
                var styleObject = name;
                var layoutCss = Object.keys(styleObject)
                    .map(function(property) {
                        return property + ':' + styleObject[property];
                    })
                    .join(';');
                this.attr('layout-css', layoutCss);
            } else {
                return this.attr('layout-' + name);
            }
        } else if (n === 0) {
            var layout = fc.utilities.layout();
            this.call(layout);
        }
        return this;
    };

    fc.utilities.layout = function() {

        // parses the style attribute, converting it into a JavaScript object
        function parseStyle(style) {
            if (!style) {
                return {};
            }
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
        function createNodes(el) {
            function getChildNodes() {
                var children = [];
                for (var i = 0; i < el.childNodes.length; i++) {
                    var child = el.childNodes[i];
                    if (child.nodeType === 1) {
                        if (child.getAttribute('layout-css')) {
                            children.push(createNodes(child));
                        }
                    }
                }
                return children;
            }
            return {
                style: parseStyle(el.getAttribute('layout-css')),
                children: getChildNodes(el),
                element: el,
                layout: {
                    width: undefined,
                    height: undefined,
                    top: 0,
                    left: 0
                }
            };
        }

        // takes the result of layout and applied it to the SVG elements
        function applyLayout(node) {
            node.element.setAttribute('layout-width', node.layout.width);
            node.element.setAttribute('layout-height', node.layout.height);
            node.element.setAttribute('transform', 'translate(' + node.layout.left + ', ' + node.layout.top + ')');
            node.children.forEach(applyLayout);
        }

        var layout = function(selection) {
            selection.each(function(data) {
                // compute the width and height of the SVG element
                var style = getComputedStyle(this);
                var width = parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                var height = parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

                // create the layout nodes
                var layoutNodes = createNodes(this);
                // set the width / height of the root
                layoutNodes.style.width = width;
                layoutNodes.style.height = height;

                // use the Facebook CSS goodness
                computeLayout(layoutNodes);

                // apply the resultant layout
                applyLayout(layoutNodes);
            });
        };
        return layout;
    };

}(d3, fc));