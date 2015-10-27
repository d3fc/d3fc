/* global document, ace, d3 */
function createPlayground() {
    'use strict';

    function setUpEditor(divId) {
        var editor = ace.edit(divId);
        editor.$blockScrolling = Infinity;
        editor.setTheme('ace/theme/crimson_editor');
        editor.setShowPrintMargin(false);
        editor.setOption('enableBasicAutocompletion', true);
        editor.getSession().on('change', function(e) {
            if (output.autoRun()) {
                output.run();
            }
        });
        return editor;
    }

    function setIFrame(iframe, html) {
        iframe = iframe.contentDocument || iframe.contentWindow.document;
        iframe.open('text/html', 'replace');
        iframe.write(html);
        iframe.close();
    }

    var output = function(editorId, editorHTMLId, loadExample) {
        document.addEventListener('DOMContentLoaded', function() {
            // Set up the editors
            ace.require('ace/ext/language_tools');
            editor = setUpEditor(editorId);
            editor.getSession().setMode('ace/mode/javascript');
            editorHTML = setUpEditor(editorHTMLId);
            editorHTML.getSession().setMode('ace/mode/html');

            // Resize Preview Pane Based On Content
            output.previewFrame()()
                .addEventListener('load', function() {
                    this.style.height = this.contentWindow.document.body.offsetHeight + 'px';
                });

            // Connect Buttons
            output.runButton()()
                .addEventListener('click', function(e) {
                    e.preventDefault();
                    output.run();
                });
            output.autoRunButton()()
                .addEventListener('click', function(e) {
                    e.preventDefault();
                    output.autoRun(!output.autoRun());
                });

            // Load Initial Example
            output.loadExample(loadExample);
        });
    };

    var _autoRunButton = function() { return document.getElementById('btnAuto'); };
    output.autoRunButton = function(x) {
        if (!arguments.length) {
            return _autoRunButton;
        }
        _autoRunButton = x;
        return output;
    };

    var _runButton = function() { return document.getElementById('btnRun'); };
    output.runButton = function(x) {
        if (!arguments.length) {
            return _runButton;
        }
        _runButton = x;
        return output;
    };

    var _previewFrame = function() { return document.getElementById('preview'); };
    output.previewFrame = function(x) {
        if (!arguments.length) {
            return _previewFrame;
        }

        _previewFrame = x;
        return output;
    };

    output.wireUpExamples = function(examples) {
        var exampleCallback = function(e) {
            e.preventDefault();
            output.loadExample(this.getAttribute('data-target'));
        };
        for (var i = 0; i < examples.length; i++) {
            examples[i].addEventListener('click', exampleCallback);
        }
        return output;
    };

    var _useLocal = false;
    output.useLocal = function(x) {
        if (!arguments.length) {
            return _useLocal;
        }
        _useLocal = x;
        return output;
    };

    var _autoRun = false;
    output.autoRun = function(x) {
        if (!arguments.length) {
            return _autoRun;
        }

        _autoRun = x;
        var btn = _autoRunButton();
        if (_autoRun) {
            btn.className = btn.className.replace('btn-default', 'btn-primary');
            output.run();
        } else {
            btn.className = btn.className.replace('btn-primary', 'btn-default');
        }

        return output;
    };

    var scriptTarget,
        editor,
        editorHTML;


    output.run = function() {
        var currentHTML = editorHTML.getSession().getValue();
        var currentJS = editor.getSession().getValue();
        if (currentHTML === 'Loading ...' || currentJS === 'Loading ...') {
            return;
        }

        currentHTML = currentHTML.replace('<body>', '<body style="margin:0">');

        // Find reference to script
        var startIndex = currentHTML.indexOf('<script src="' + scriptTarget + '"');
        var endIndex = currentHTML.indexOf('</script>', startIndex);
        var merged = currentHTML.substr(0, startIndex);
        merged += '<script type="text/javascript">';
        merged += currentJS;
        merged += currentHTML.substr(endIndex);

        setIFrame(output.previewFrame()(), merged);
    };

    output.loadJavaScript = function(script) {
        editor.getSession().setValue(script);
        editor.setReadOnly(false);
        output.run();
    };

    output.loadJavaScriptAJAX = function(url) {
        editor.setReadOnly(true);
        editor.getSession().setValue('Loading ...');
        d3.text(url, 'text/plain', output.loadJavaScript);
    };

    output.loadHTML = function(html) {
        // Switch to local d3fc if available
        if (output.useLocal()) {
            html = html.replace(/<!-- (<script [^>]*><\/script>) -->/, function(m, p1) { return p1; });
            html = html.replace(/"https:([^"])*\/d3fc.bundle.min.css"/, '"http://localhost:9000/assets/d3fc.css"');
            html = html.replace(/"https:([^"])*\/d3fc.min.js"/, '"http://localhost:9000/assets/d3fc.js"');
        }

        editorHTML.getSession().setValue(html);
        editorHTML.setReadOnly(false);
        output.run();
    };

    output.loadHTMLAJAX = function(url) {
        editorHTML.getSession().setValue('Loading ...');
        editorHTML.setReadOnly(true);
        d3.text(url, 'text/plain', output.loadHTML);
    };

    output.loadExample = function(exampleName) {
        scriptTarget = exampleName + '.js';
        output.loadJavaScriptAJAX('examples/' + exampleName + '.js');
        output.loadHTMLAJAX('examples/' + exampleName + '.html');
        setIFrame('<HTML><Body>Loading ...</Body></HTML>');
    };

    return output;
}
