== 1.4.1 (2015-07-16)

* Fix issues when ngModel would be defined, but falsy. Allow ngModel to be falsy by stricly checking it's type. Contribution by [Simon Elliott](https://github.com/purge).
* Allow a custom parent container for the toolbar (instead of inserting it in the body), using the `toolbarContainer` attribute. Contribution by [Antonin Januska](https://github.com/AntJanus).

== 1.3.2 (2015-04-22)

* Remove the jQuery dependency. Contributions by [Antonin Januska](https://github.com/AntJanus).

== 1.3.1 (2014-11-25)

* Hotfixes for the two-way binding functionality.

== 1.3.0 (2014-11-25)

* Implement two-way binding using `ng-model`.
* Editor toolbar positioning fixes for when single-clicking a selection was still showing the toolbar with wrong positioning.

== 1.2.0 (2014-08-27)

* Change the behavior of the `font-size` selector, to not use `styleWithCSS`, and generate a `<font>` tag. This is required so that we can have consistent behavior between browsers - Firefox does not respect the `styleWithCSS` flag on `fontSize` and was generating `<font>` tags anyway. https://bugzilla.mozilla.org/show_bug.cgi?id=1022904

* Remove `font-family` auto selection when showing the toolbar, because it was causing issues with the new `font-size` behavior - since we now have multiple editor toolbars the last selection will still stay active.

== 1.1.2 (2014-06-09)

* Fix Firefox issues with changing styles using the `select` dropdowns.
* Improve text style change performance, by minimizing number of triggered events on property changes.

== 1.1.1 (2014-05-24)

* Fix issues with the toolbar not hiding in certain conditions, even if the selection was lost.
* Fix cross-browser issues with the toolbar positioning.

== 1.1 (2014-05-23)

* Fix error thrown in certain cases when the editor was loosing focus.
* Move the editor toolbar in the body, so we can use `overflow: hidden` in containers.
* Improve the editor toolbar positioning.
* Overall development environment clean-up.

== 1.0.0 (2013-11-11)

* Initial release.
