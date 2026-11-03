---
'zyzz-lynx': patch
---

Lynx builds that composed definitions independently named the base declarations of a `variants` recipe as units of their own, so a recipe such as `variants({ base: { alignItems: 'center' }, selection: 'className', ... })` emitted `.zcq{align-items:center;}` beside the `.z9{align-items:center;}` that plain styles shared, and the stylesheet repeated one rule per recipe base declaration. The base now reads the shared units, and the recipe's choice and compound class rules print after them, so a choice still overrides its base. Ordered composition, development builds, and the web target keep their output.
