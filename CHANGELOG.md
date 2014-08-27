== 1.2.0 (August 27, 2014)

* Change the behavior of the `font-size` selector, to not use `styleWithCSS`, and generate a `<font>` tag. This is required so that we can have consistent behavior between browsers - Firefox does not respect the `styleWithCSS` flag on `fontSize` and was generating `<font>` tags anyway. https://bugzilla.mozilla.org/show_bug.cgi?id=1022904

* Remove `font-family` auto selection when showing the toolbar, because it was causing issues with the new `font-size` behavior - since we now have multiple editor toolbars the last selection will still stay active.

== 1.1.2 (June 9, 2014)

* Fix Firefox issues with changing styles using the `select` dropdowns.
* Improve text style change performance, by minimizing number of triggered events on property changes.

== 1.1.1 (May 24, 2014)

* Fix issues with the toolbar not hiding in certain conditions, even if the selection was lost.
* Fix cross-browser issues with the toolbar positioning.

== 1.1 (May 23, 2014)

* Fix error thrown in certain cases when the editor was loosing focus.
* Move the editor toolbar in the body, so we can use `overflow: hidden` in containers.
* Improve the editor toolbar positioning.
* Overall development environment clean-up.

== 1.0.0 (November 11, 2013)

* Initial release.

