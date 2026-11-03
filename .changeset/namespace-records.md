---
'zyzz-lynx': patch
---

`cx` compositions resolved applications of a `namespace styles` member only when every member was a definition call, so a `const row = { ... } as const` record beside the definitions failed with `Composition requires statically known local style applications.` A namespace with records now folds its definitions as before. An erased namespace takes its records with it, and a record another read reaches keeps the namespace object.
