---
'zyzz-lynx': patch
---

Graph compiles now drop initialization guards from local style applications in modules that share no import cycle with other sources, including reads inside function declarations and after top-level calls such as `graphql(...)` or `createContext(false)` that pass no local function. Same-file `namespace styles` applications then render the constant class strings an imported style module produces, and a static `cx` composition spread alone onto an element becomes its `className`. Packages outside the graph are assumed never to import its sources.
