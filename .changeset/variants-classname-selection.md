---
'zyzz-lynx': patch
---

Added `selection: 'className'` to `variants`. Applications of such a recipe return the class list string, so `className={styles.badge({ tone })}` works without a spread. The recipe selects with classes like `selection: 'class'`, accepts a `className` override, and rejects conditions and dynamic choices.
