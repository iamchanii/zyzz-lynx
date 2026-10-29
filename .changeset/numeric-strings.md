---
'zyzz-lynx': patch
---

Number properties such as `opacity`, `fontWeight`, and `zIndex`, plus `aspectRatio`, now accept CSS number strings such as `'0'`, `'700'`, and `'1.5'`. CSS output keeps the authored spelling, `fontWeight` tokens accept numeric strings, and React Native converts these strings to numbers, with a nonzero `lineHeight` string acting as a multiplier.
