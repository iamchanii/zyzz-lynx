---
'zyzz-lynx': patch
---

Variable scope selections with literal arguments, such as `vars()`, `vars({ colorScheme: 'dark' })`, and `cx(vars({}), styles.page())`, now compile to the constant props the runtime selector returned, including the inline `color-scheme` style of a selected scheme. A module whose selections all fold no longer imports the selection or composition runtime, keeps a bare import of the configuration module it read so that module's effects still load, and a module-local configuration no longer emits its selector for them. Dynamic arguments keep the runtime selector, and the scheme classes are emitted only when a selection, script, or root control can apply them.
