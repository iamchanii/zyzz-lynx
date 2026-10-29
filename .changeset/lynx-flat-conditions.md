---
'zyzz-lynx': patch
---

Fixed nested conditions on the `lynx` target, which the Lynx template encoder dropped. `style({ ':active': { opacity: 0.4 } })` now emits `.z…:active{opacity:0.4;}` instead of `.z…{&:active{opacity:0.4;}}`, nested selectors resolve `&` to the class, and `@media` queries wrap the class rule. Grouped output splits into flat rules in authored order. Conditions that Lynx never matches, such as `:first-child`, `::before`, `[attr~=value]`, and at-rules other than `@media`, are compile errors such as ``The lynx target does not support `:first-child`.``
