---
'zyzz-lynx': patch
---

Kept the `zyzz.css` module of `zyzz/rspeedy` out of `node_modules`, so split-chunk vendor groups no longer move it into an empty `npm-.virtual` chunk.
