---
'zyzz-lynx': patch
---

Fixed `zyzz/rspeedy` watch builds that stopped rebuilding after a compile error, such as `Source.ExtractError`. The error is now reported as a compilation error, and the scanned sources stay watched, so fixing the source triggers a rebuild.
