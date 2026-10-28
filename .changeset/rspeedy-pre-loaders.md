---
'zyzz-lynx': patch
---

Fixed `zyzz/rspeedy` builds that failed with `Zyzz must run before source transforms` when the project registers `enforce: 'pre'` loaders. The Zyzz transform now runs before every other loader, including other pre loaders.
