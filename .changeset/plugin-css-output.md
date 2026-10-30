---
'zyzz-lynx': patch
---

The Rspeedy plugin and the Unplugin plugins accept `cssOutput`, which sets the CSS representation of helpers imported directly from `zyzz`, including the bases of Lynx recipes inside `cx` calls. Config-bound helpers keep their config's mode. A `cx` composition of styles without their own mode now merges under the default, with Babel's `cssOutput` as well. `zyzz({ cssOutput: 'grouped' })` emits one class per style, so a Lynx bundle stores one parsed rule per style instead of one per declaration.
