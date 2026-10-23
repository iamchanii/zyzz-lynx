---
'zyzz-lynx': patch
---

Added the `zyzz/rspeedy` plugin for Lynx applications built with Rspeedy. It compiles project sources in each Rspeedy environment and serves the combined stylesheet as the `zyzz.css` module, so the entry adds the styles to the Lynx bundle with `import 'zyzz.css'`. Rspeedy builds emit no separate `zyzz.css` or `zyzz.js` files.

The package is published as `zyzz-lynx`. Install it under the `zyzz` alias with `pnpm add zyzz@npm:zyzz-lynx`, so authoring imports keep the `zyzz` specifier.
