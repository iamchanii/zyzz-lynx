---
'zyzz-lynx': minor
---

Added `selection: 'className'` to `variants`. It selects choices with classes like `selection: 'class'`, and applications return the class list string, so Lynx elements take `className={styles.badge({ tone: 'success' })}` directly. The compiler rejects `conditions` and dynamic choices in these recipes, and native compilation rejects the option.
