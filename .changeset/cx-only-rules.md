---
'zyzz-lynx': patch
---

Styles applied only inside `cx` calls no longer emit their own CSS rules, since each `cx` call emits rules for its combined declarations. A module-local style qualifies when every read is such an application, except in Vite and Next.js development builds. An exported style, including a member of an exported namespace, qualifies when the host compiles every module in one graph (the Rspeedy and other unplugin hosts) and no module reads it another way, so `cx(styles.field(), styles.edit())` alone leaves out the rules of `field` and `edit`.
