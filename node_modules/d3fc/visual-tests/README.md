The visual tests allow for manual verification of the correctness of the components. Each test should aim to test one component in isolation. Any "jazzy" multi-component examples should be added to the website instead.

Tests are added to the ```visual-tests/src/test-fixtures``` directory under a structure which should mirror the ```src``` structure. At a minimum each test consists of a handlebars template file ```xxx.hbs``` which has the following structure -

```
---
title: <name of test (normally the some variation of the component name)>
description: "<description of test>"
categories: <the top level folder name in which the component resides>
tags:
- <component name>
- <some defining characteristic of the test>
- <...>
testScripts:
- <reference to script file containing test code>
- <...>
---
<!-- HTML structure required for the test. N.B. each test runs in it's own document -->
<div id="layout-programmatic"></div>
```
