---
'zyzz-lynx': patch
---

The Rspeedy plugin and the Unplugin plugins accept `cssOutput`, which sets the CSS representation of helpers imported directly from `zyzz`, including the bases of Lynx recipes. Config-bound helpers keep their config's mode. `zyzz({ cssOutput: 'grouped' })` emits one class per style instead of one per declaration, so a Lynx bundle stores fewer parsed rules. A `cx` composition of styles without their own mode now merges under the default, with Babel's `cssOutput` as well, and a merged `cx` call no longer folds the choice rules of a Lynx recipe into one rule.
