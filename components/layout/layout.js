/* globals computeLayout */
(function(d3, fc, cssLayout) {
    'use strict';


    d3.selection.prototype.layout = function(name, value) {
        var layout = fc.layout();
        var n = arguments.length;
        if (n === 2) {
            if (typeof name !== 'string') {
                layout.width(name).height(value);
                this.call(layout);
            } else {
                this.attr('layout-css', name + ':' + value);
            }
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
                return Number(this.attr('layout-' + name));
            }
        } else if (n === 0) {
            this.call(layout);
        }
        return this;
    };

    fc.layout = function() {

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
            if (node.element.nodeName.match(/(?:svg|rect)/i)) {
                node.element.setAttribute('width', node.layout.width);
                node.element.setAttribute('height', node.layout.height);
                node.element.setAttribute('x', node.layout.left);
                node.element.setAttribute('y', node.layout.top);
            } else {
                node.element.setAttribute('transform',
                    'translate(' + node.layout.left + ', ' + node.layout.top + ')');
            }
            node.children.forEach(applyLayout);
        }

        var layout = function(selection) {
            selection.each(function(data) {
                // compute the width and height of the SVG element
                var style = getComputedStyle(this);
                var width, height;

                if (layout.width.value !== -1) {
                    width = layout.width.value;
                } else {
                    width = parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                }
                if (layout.height.value !== -1) {
                    height = layout.height.value;
                } else {
                    height = parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
                }

                // create the layout nodes
                var layoutNodes = createNodes(this);
                // set the width / height of the root
                layoutNodes.style.width = width;
                layoutNodes.style.height = height;

                // use the Facebook CSS goodness
                cssLayout.computeLayout(layoutNodes);

                // apply the resultant layout
                applyLayout(layoutNodes);
            });
        };

        layout.width = fc.utilities.property(-1);
        layout.height = fc.utilities.property(-1);

        return layout;
    };

}(d3, fc, computeLayout));