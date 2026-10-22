---
'zyzz-lynx': patch
---

Web runtime selection and composition, and compiled variant selectors, check own properties with `Object.prototype.hasOwnProperty.call` instead of `Object.hasOwn`, so Lynx JavaScript engines without `Object.hasOwn` load pages that use `vars()` and `variants()`.
