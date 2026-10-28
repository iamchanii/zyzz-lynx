---
'zyzz-lynx': patch
---

Added the `lynx` compile target, which `zyzz/rspeedy` always uses, and exposed it as `target: 'lynx'` on `Graph.compile`, `Transform.compile`, `Source.extract`, and the `zyzz/unplugin` options. The Lynx template encoder keeps only flat class rules, so recipes on this target select with classes by default and emit each choice and compound as one rule under its own class, such as `.zv…0 { height: 40px }`. Applications add compound classes themselves, so every recipe rule keeps one-class specificity and later styles, including `cx` arguments, still win by order. Compositions copy the recipe rules under their own prefix and rename the application's choice classes. `selection: 'attribute'` and `conditions` are compile errors on this target.
