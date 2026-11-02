---
'zyzz-lynx': patch
---

Lynx builds keep `top`, `right`, `bottom`, and `left` declarations as longhands. Lightning CSS merged four sides of one rule into the `inset` shorthand during the final stylesheet pass, and the Lynx template encoder removed `inset` as unsupported, so elements positioned with all four sides lost their offsets. The `zyzz/rspeedy` plugin now expands `inset` back into its longhands after that pass.
