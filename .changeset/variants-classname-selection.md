---
'zyzz-lynx': minor
---

Added `selection: 'className'` to `variants` and made it the default for recipes without conditions or dynamic choices. These recipes select choices with classes, and applications return the class list string, so elements take `className={styles.badge({ tone: 'success' })}` directly. Recipes with conditions or dynamic choices keep `data-*` attribute props. Declare `selection: 'attribute'` or `selection: 'class'` to keep spreading props, as `cx` and native code need.
