---
'zyzz-lynx': minor
---

The `zyzz/rspeedy` plugin composes definitions independently by default, so a declaration repeated across styles shares one rule and the Lynx stylesheet holds about half as many rules. Lynx elements combine styles only through `cx`, which keeps its argument order, and each style keeps its own declaration order. `options.composition: 'ordered'` restores one rule per declaration per module, and a `composition` setting on `defineConfig` still applies to that config's definitions. The portable `zyzz/unplugin` options accept `composition` as well.
