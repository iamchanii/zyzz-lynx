---
'zyzz-lynx': minor
---

Lynx builds printed token references without their fallback, as `var(--z-color-brand)` instead of `var(--z-color-brand,#06c)`, since the Lynx template encoder stores each fallback beside the value and in a per-rule map, and the Lynx root carries the theme scope that defines every variable. Lynx production builds that compile every module in one graph also named token custom properties from the theme table in path order, such as `--z5`, and `@keyframes` rules from one table in module order, such as `z1`, in the stylesheet, in every `animation` value, and in the constant a `keyframes()` binding exports. Web builds, development builds, partial graphs, and packed libraries keep their readable names.
