---
layout: example
title: Basecoin
namespace: examples
---
<style>@import "index.css";</style>

<div id="viewport">
    <div id="camera">
        <svg id="background" viewbox="0 0 1024 576" mask="url(#mask)">
            <g id="vertical-lines"/>
        </svg>
        <svg id="midground" viewbox="0 0 1024 576">
            <defs>
                <mask id="mask">
                    <rect width="1024" height="576" fill="white"/>
                    <rect width="1024" height="576" fill="url(#mask-horizontal-gradient)"/>
                    <rect width="1024" height="576" fill="url(#mask-vertical-gradient)"/>
                    <linearGradient id="mask-horizontal-gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stop-opacity="1"/>
                        <stop offset="30%" stop-opacity="0"/>
                        <stop offset="70%" stop-opacity="0"/>
                        <stop offset="100%" stop-opacity="1"/>
                    </linearGradient>
                    <linearGradient id="mask-vertical-gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-opacity="1"/>
                        <stop offset="30%" stop-opacity="0"/>
                        <stop offset="70%" stop-opacity="0"/>
                        <stop offset="100%" stop-opacity="1"/>
                    </linearGradient>
                </mask>
                <filter id="blur" x="0%" y="0%" width="30%" height="100%">
                    <feImage xlink:href="#series" x="0" y="0" width="1024" height="576" result="image"/>
                    <feGaussianBlur in="image" stdDeviation="5"/>
                </filter>
                <mask id="blur-mask" x="0%" y="0%" width="30%" height="100%">
                    <rect width="1024" height="576" fill="url(#blur-mask-gradient)"/>
                    <linearGradient id="blur-mask-gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stop-color="white"/>
                        <stop offset="30%" stop-color="black"/>
                    </linearGradient>
                </mask>
                <mask id="inverted-blur-mask" x="0%" y="0%" width="100%" height="100%">
                    <rect width="1024" height="576" fill="url(#inverted-blur-mask-gradient)"/>
                    <linearGradient id="inverted-blur-mask-gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stop-color="black"/>
                        <stop offset="30%" stop-color="white"/>
                    </linearGradient>
                </mask>
                <filter id="flare" x="40%" y="30%" width="11%" height="40%">
                    <feImage xlink:href="#series" x="0" y="0" width="1024" height="576" result="image"/>
                    <feFlood flood-color="white" result="white-flood"/>
                    <feComposite in="white-flood" in2="image" operator="atop" result="white-image"/>
                    <feGaussianBlur in="white-image" stdDeviation="3" result="white-blur"/>
                    <feColorMatrix type="saturate" in="image" values="10" result="saturated-image"/>
                    <feComposite in="white-blur" in2="saturated-image" operator="over"/>
                </filter>
                <mask id="flare-mask" x="40%" y="30%" width="11%" height="40%">
                    <rect width="1024" height="576" fill="url(#flare-mask-gradient)"/>
                    <linearGradient id="flare-mask-gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="40%" stop-color="black"/>
                        <stop offset="45%" stop-color="white"/>
                    </linearGradient>
                </mask>
            </defs>
            <g id="gridlines" mask="url(#mask)"/>
            <g mask="url(#inverted-blur-mask)">
                <g id="series"/>
            </g>
            <g filter="url(#blur)" mask="url(#blur-mask)"/>
            <g filter="url(#flare)" mask="url(#flare-mask)"/>
        </svg>
        <svg id="foreground" viewbox="0 0 1024 576">
            <g id="labels" mask="url(#mask)"/>
        </svg>
    </div>
</div>

This example shows how d3fc components can be used to recreate an approximation of the background video on the [Coinbase exchange](https://exchange.coinbase.com/) homepage.

This example makes use of a number of components, including the data generator, series and indicators. It also mixes in some SVG filter effects and 3D transforms for good measure.

For a detailed overview of how this chart was implemented, pop over to the Scott Logic blog which covers the details [in this blog post](http://blog.scottlogic.com/2015/08/06/an-adventure-in-svg-filter-land.html).


<script src="index.js"></script>
