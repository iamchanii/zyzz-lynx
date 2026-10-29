---
'zyzz-lynx': patch
---

Added the Lynx `rpx` and `sp` length units to the length types, so `marginTop: '-6.4sp'` type-checks. The `lynx` target emits them as authored. The `web` target reports them in style declarations other than custom properties as invalid literals, such as ``The `sp` unit requires the lynx target.``, and breakpoint and container thresholds reject them.
