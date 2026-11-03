---
'zyzz-lynx': patch
---

A variable configuration exported from a module of a complete graph, such as an Rspeedy build, dropped its runtime selector when every module read its `vars` export only through selections with literal arguments, which fold to constant props, or through token references, so the selection runtime and its helpers left both thread chunks. A selection with a dynamic argument, a selector read as a value, a re-export, a dynamic import of the configuration module, a graph that may lack readers, and development builds kept the selector.
