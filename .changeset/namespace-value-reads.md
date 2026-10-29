---
'zyzz-lynx': patch
---

Fixed `cx` failing across a module when a `namespace styles` member or local definition is read as a value, such as `[styles.l1, styles.l2][index]()`. Only the definitions read that way stay runtime functions, so other `cx` calls compose again. When a read exposes the namespace object, such as `Object.values(styles)`, composing its members now reports `Composition requires direct applications of styles, which this read prevents.` at that read instead of at an unrelated `cx` call.
