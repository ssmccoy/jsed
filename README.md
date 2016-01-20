JSON Stream EDitor.

This is a slightly cleaned-up offshoot of a thing I built a long while
back when at say media.  It's basically like `json_xs` but written in
node to let you edit JSON streams using javascript expressions (while
pretty-printing them).

Features supported presently:
  * The ability to transform an object through mutation of `this`.
  * The ability to replace an object by using `return`.
  * Pretty printing.
  * Control over indent level.

The author recommends [jq](https://github.com/stedolan/jq) instead.
