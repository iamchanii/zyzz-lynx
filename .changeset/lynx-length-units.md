---
'zyzz-lynx': patch
---

Added the Lynx `rpx` and `sp` length units to the length types, so `marginTop: '-6.4sp'` type-checks. The `lynx` target emits them as authored, and the `web` target reports them as invalid literals, such as `The \`sp\` unit requires the lynx target.`
