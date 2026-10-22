---
'zyzz-lynx': patch
---

Styles compile literal constants imported from packages that do not depend on Zyzz, such as `vars.color.bg.layerDefault` from `@seed-design/lynx-css/vars`, when every module the import reaches only declares and re-exports constants. `export * as name from` re-exports now publish their literal exports as an object.
