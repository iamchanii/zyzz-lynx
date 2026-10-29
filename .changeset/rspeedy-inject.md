---
'zyzz-lynx': patch
---

Added the `inject` option to `zyzz/rspeedy`. With `zyzz({ inject: true })`, every entry imports `zyzz.css` before its own modules, and a remaining manual `import 'zyzz.css'` resolves to the same module. The option defaults to `false`, so entries still import the stylesheet themselves.
