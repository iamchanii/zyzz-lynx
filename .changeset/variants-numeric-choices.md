---
'zyzz-lynx': patch
---

Recipe choices may use array-index names such as `'1'` and `'10'` under class selection, which Lynx recipes use by default. The compiler numbers choices in JavaScript own-property order, so compiled and uncompiled applications select the same choice classes.
