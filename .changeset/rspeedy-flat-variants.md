---
'zyzz-lynx': patch
---

Fixed `zyzz/rspeedy` variants that lost their declarations in Lynx templates. The Lynx template encoder drops nested rules and `:where()` selectors, so recipes declared with `selection: 'class'` now compile to flat choice rules such as `.zv…0 { height: 40px }`, and compounds to their choice class combinations.
