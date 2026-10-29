---
'zyzz-lynx': patch
---

Names derived from bindings for `keyframes`, `counterStyle`, `positionTry`, `customMedia`, `cssFunction`, `colorProfile`, and `fontPaletteValues` now include a six-character hash of the declaring module, as style classes do, such as `z-k-3PBZzK-enter` instead of `z-k-enter`. Two modules can declare the same binding, such as `const enter = keyframes(…)`, without a `Conflicting animation identity` error. Explicit `{ id }` names are unchanged. CSS that spells a generated name by hand must switch to an explicit `id`.
