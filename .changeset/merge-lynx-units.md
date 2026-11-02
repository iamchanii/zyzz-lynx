---
'zyzz-lynx': minor
---

Production Rspeedy builds with independent composition merged the atomic units that every class list of the bundle applied together. The `zyzz/rspeedy` plugin read the stylesheet and both thread scripts of the compilation before minification, grouped the units of one class whose string literals named them in exactly the same places, and printed each group as one rule under its first member's name with the declarations in stylesheet order, while the other names left every class list. A group stayed apart when a rule between its first and last member declared a property of a family that a moved member also declared, since the move would have changed which declaration won, and pseudo-class, media, recipe choice, composition copy, and theme rules never merged. `units: 'atomic'` kept one rule per unit, and development builds and `composition: 'ordered'` were unchanged.
