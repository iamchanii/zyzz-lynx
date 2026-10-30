---
'zyzz-lynx': patch
---

The Rspeedy plugin and the Unplugin plugins accept `cssOutput`, which sets the CSS representation for styles without their own mode, including helpers imported directly from `zyzz`. `zyzz({ cssOutput: 'grouped' })` emits one class per style, so a Lynx bundle stores one parsed rule per style instead of one per declaration.
