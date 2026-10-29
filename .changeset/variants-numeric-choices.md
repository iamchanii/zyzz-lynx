---
'zyzz-lynx': patch
---

Recipe choices accept quoted array-index names such as `'1'` and `'10'` under class selection, which Lynx recipes use by default. Choice classes and payload slots follow JavaScript own-property order, so compiled and uncompiled applications agree, and emitted rules keep the authored order. A recipe that fails to compile no longer adds a composition error at the `cx` call that applies it, and an unquoted numeric choice name reports that it needs quotes.
