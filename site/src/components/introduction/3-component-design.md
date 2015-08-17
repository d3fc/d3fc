---
layout: component
title: Component Design
namespace: introduction
---

A full description and example of each component can found in the navigation menu.

##Design

**This library is opinionated.**

Listed below are the conscious design decisions and trade-offs which you should be aware of.

### Re-use

**Over everything else.**

Components have no internal state. They can be called on multiple selections without needing to clear down any internal state. Additionally, the render lifecycle is identical whether creating or updating components.

### Composition

**Over customisability.**

Components offer a basic set of customisation options but to keep the API as clean as possible, they do not allow every possible detail to be customised. For example, they will rebind selected properties of sub-components rather than expose them directly.

If you do wish to heavily customise a component, you are expected to create your own implementation re-using the sub-components of the original.

### Simplicity

**Over performance.**

Components do not cache the results of any calculations nor attempt any other performance optimisations (beyond [D3's update pattern](http://bost.ocks.org/mike/selection/)). For example, every call will recalculate everything from the supplied data.
