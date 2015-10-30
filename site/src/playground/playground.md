---
layout: playground
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
<div class="container playground" id="main">
    <h1>
        Playground
        <div class="pull-right">
            <a id="btnRun" class="btn btn-default">
                <i class="fa fa-play"></i> Run
            </a>
            <a id="btnAuto" class="btn btn-default">
                <i class="fa fa-forward"></i> AutoRun
            </a>
        </div>
    </h1>
    <div class="row">
        <div class="col-md-12">
            <iframe id="preview" scrolling="no" style="border:none; width: 100%;"></iframe>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h2>JavaScript</h2>
            <div class="editorContainer">
                <div id="editor">
                    Loading ...
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h2>HTML</h2>
            <div class="editorContainer">
                <div id="editorHTML">
                    Loading ...
                </div>
            </div>
        </div>
    </div>
</div>
