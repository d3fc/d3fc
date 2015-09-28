import computeLayout from 'css-layout';
import d3 from 'd3';
import innerDimensions from '../util/innerDimensions';

function _layout() {

    var width = -1,
        height = -1;

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
            element: el
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
            var dimensions = innerDimensions(this);

            // create the layout nodes
            var layoutNodes = createNodes(this);

            // set the width / height of the root
            layoutNodes.style.width = width !== -1 ? width : dimensions.width;
            layoutNodes.style.height = height !== -1 ? height : dimensions.height;

            // use the Facebook CSS goodness
            computeLayout(layoutNodes);

            // apply the resultant layout
            applyLayout(layoutNodes);
        });
    };

    layout.width = function(x) {
        if (!arguments.length) {
            return width;
        }
        width = x;
        return layout;
    };
    layout.height = function(x) {
        if (!arguments.length) {
            return height;
        }
        height = x;
        return layout;
    };

    return layout;
}

function layoutAdapter(name, value) {
    // Quick bodge to fix #568
    if (this.node() == null) {
        return this;
    }
    var layout = _layout();
    var n = arguments.length;
    if (n === 2) {
        if (typeof name !== 'string') {
            // layout(number, number) - sets the width and height and performs layout
            layout.width(name).height(value);
            this.call(layout);
        } else {
            // layout(name, value) - sets a layout- attribute
            this.node().setAttribute('layout-css', name + ':' + value);
        }
    } else if (n === 1) {
        if (typeof name !== 'string') {
            // layout(object) - sets the layout-css property to the given object
            var styleObject = name;
            var layoutCss = Object.keys(styleObject)
                .map(function(property) {
                    return property + ':' + styleObject[property];
                })
                .join(';');
            this.node().setAttribute('layout-css', layoutCss);
        } else {
            // layout(name) - returns the value of the layout-name attribute
            return Number(this.node().getAttribute('layout-' + name));
        }
    } else if (n === 0) {
        // layout() - executes layout
        this.call(layout);
    }
    return this;
}

d3.selection.prototype.layout = layoutAdapter;
d3.transition.prototype.layout = layoutAdapter;

export default _layout;
