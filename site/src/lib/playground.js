/* global document, ace, d3 */
function createPlayground() {
    'use strict';

    var scriptTarget,
        editor,
        editorHTML;

    function setUpEditor(divId) {
        var aceEdit = ace.edit(divId);
        aceEdit.$blockScrolling = Infinity;
        aceEdit.setTheme('ace/theme/crimson_editor');
        aceEdit.setShowPrintMargin(false);
        aceEdit.setOption('enableBasicAutocompletion', true);
        aceEdit.setOption('maxLines', 'Infinity');
        aceEdit.getSession().on('change', function(e) {
            if (output.autoRun()) {
                output.run();
            }
        });
        return aceEdit;
    }

    function setIFrame(iframe, html) {
        var timerId = iframe.contentWindow.setTimeout(function() {}, 10000);
        for (var i = 0; i <= timerId; i++) {
            iframe.contentWindow.clearTimeout(i);
        }

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
            output.previewFrame()
                .addEventListener('load', function() {
                    this.style.height = this.contentWindow.document.body.offsetHeight + 'px';
                });

            // Connect Buttons
            output.runButton()
                .addEventListener('click', function(e) {
                    e.preventDefault();
                    output.run();
                });
            output.autoRunButton()
                .addEventListener('click', function(e) {
                    e.preventDefault();
                    output.autoRun(!output.autoRun());
                });

            // Load Initial Example
            output.loadExample(loadExample);
        });
    };

    output.autoRunButton = function() {
        return document.getElementById('btnAuto');
    };

    output.runButton = function() {
        return document.getElementById('btnRun');
    };

    output.previewFrame = function() {
        return document.getElementById('preview');
    };

    output.singleFile = true;

    var _autoRun = false;
    output.autoRun = function(x) {
        if (!arguments.length) {
            return _autoRun;
        }

        _autoRun = x;
        var btn = output.autoRunButton();
        if (_autoRun) {
            btn.className = btn.className.replace('btn-default', 'btn-primary');
            output.run();
        } else {
            btn.className = btn.className.replace('btn-primary', 'btn-default');
        }
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

        setIFrame(output.previewFrame(), merged);
    };

    output.loadJavaScript = function(script) {
        editor.getSession().setValue(script.trim());
        editor.setReadOnly(false);
        output.run();
    };

    output.loadJavaScriptAJAX = function(url) {
        editor.setReadOnly(true);
        editor.getSession().setValue('Loading ...');
        d3.text(url, 'text/plain', output.loadJavaScript);
    };

    output.loadHTML = function(html) {
        if (html.match(/<script data-src="/)) {
            // Single File
            html = html.replace(
                /<script data-src="([^"]*)">([\s\S]+?)<\/script>/,
                function(match, p1, p2) {
                    scriptTarget = p1;
                    output.loadJavaScript(p2);
                    return '<script src="' + p1 + '"></script>';
                });
        }

        editorHTML.getSession().setValue(html.trim());
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
        if (!output.singleFile) {
            output.loadJavaScriptAJAX('examples/' + exampleName + '.js');
        }
        output.loadHTMLAJAX('examples/' + exampleName + '.html');
        setIFrame(output.previewFrame(), '<HTML><Body>Loading ...</Body></HTML>');
    };

    return output;
}
