---
'zyzz-lynx': patch
---

Compiled recipe callables read each axis with a direct property read, such as `input["tone"]`, instead of an `Object.prototype.hasOwnProperty.call` guard. A missing key and an explicit `undefined` already selected alike, so only axes named after `Object.prototype` members, such as `constructor`, keep the guard. Class-selection recipes also dropped the `String(value)` coercion on axes whose choices no boolean, number, or bigint could spell after coercion, while axes with `true`, `false`, `NaN`, `Infinity`, or numeric choices keep it, so `styles.button({ solid: true })` still selects the `"true"` choice.
