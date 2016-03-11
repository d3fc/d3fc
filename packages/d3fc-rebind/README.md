# d3fc-rebind

Utilities for copying methods from one d3 component to another in a configurable way

[Main d3fc package](https://github.com/ScottLogic/d3fc)

# Installation

```bash
npm install d3fc-rebind
```

# API

#### **rebind**(*source*, *target*, *...names*)

Provides the same functionality as `d3.rebind` -

> Copies the methods with the specified `names` from `source` to `target`, and returns `target`. Calling one of the named methods on the target object invokes the same-named method on the source object, passing any arguments passed to the target method, and using the source object as the this context. If the source method returns the source object, the target method returns the target object (“setter” method); otherwise, the target method returns the return value of the source method (“getter” mode). The rebind operator allows inherited methods (mix-ins) to be rebound to a subclass on a different object.

#### **rebindAs**(*source*, *target*, *mappings*)

Provides the same functionality as [`rebind`](#rebind) but allows specifying a custom set of `mappings` from the `source` property names to the `target` property names.

#### **rebindAll**(*source*, *target*, *[prefix]*, *[...exclusions]*)

Provides the same functionality as [`rebind`](#rebind) but copies all properties found on `source` to `target`. To de-conflict property names a custom `prefix` can be specified which will be pre-pended and the initial letter of the source property name capitalized e.g. if prefix is set to `foo`, `source.bar()` would become `target.fooBar()`. A  set of `exclusions` can be specified to prevent those properties being copied over, these can be specified as `string`s or `RegExp`s.
