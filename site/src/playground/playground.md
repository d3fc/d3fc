---
layout: default
title: D3FC Playground
script-extra: |
    <script src="https://cdn.jsdelivr.net/ace/1.2.0/noconflict/ace.js"></script>
    <script src="https://cdn.jsdelivr.net/ace/1.2.0/noconflict/ext-language_tools.js"></script>
    <script type='text/javascript'>
        var playGround = createPlayground();
        playGround.useLocal = document.URL.match(/[?&]local([&=]|$)/i);
        playGround('editor', 'editorHTML', (document.URL.match(/[?&]example=([^&]*)/i) || ['', 'horizon'])[1]);
    </script>

css-extra: |
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
---
<div class="container-fluid playground" id="main">
    <div class="row">
        <div class="col-md-12 text-right">
            <a id="btnRun" class="btn btn-default"><i class="fa fa-play"></i> Run</a>
            <a id="btnAuto" class="btn btn-default"><i class="fa fa-forward"></i> AutoRun</a>
        </div>
    </div>
    <div class="row">
        <div class="col-md-5 col-md-push-7">
            <h3>Preview</h3>
            <iframe id="preview" scrolling="no" style="border:none; width: 100%;">
            </iframe>
        </div>
        <div class="col-md-7 col-md-pull-5">
            <h3>HTML</h3>
            <div class="editorContainer">
                <div id="editorHTML" style="width:100%; height: 300px;">
                    Loading ...
                </div>
            </div>
            <div class="editorContainer">
                <h3>JavaScript</h3>
                <div id="editor" style="width:100%; height: 300px;">
                    Loading ...
                </div>
                <div>
                </div>
            </div>
        </div>
    </div>
</div>
