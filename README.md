# resizeit2

A rewrite (from scratch) of the [ResizeIT Firefox extension](https://addons.mozilla.org/firefox/addon/resizeit/). <s>It hasn’t been updated in years and is not compatible with Firefox 57+.</s>

I think it’s a great tool, especially with frequently changing monitor setups.

I’ll try to make it compatible with Chrome, too. Eventually.

## About this branch (customizable-shortcuts)

In this branch, I allow for customizable keyboard shortcuts. The user would focus a textbox and press the desired shortcut.

Unfortunately, Javascript does not offer any method to reliably retrieve the unmodified key presses. As such, this method does not work.

## Building

This extension is written using TypeScript. To get started, run `npm install` or `yarn`.

To build and check for type errors, use `npm run build`, `yarn run build` or `yarn build`.

To pack the extension, use `npm run pack` or `yarn run pack` (`yarn pack` does something different). This command requires a UNIX-style `zip` command to be present in `$PATH`. On Windows, you could use Cygwin.

## Notes

This extension is using `browser.storage.local`. Why? Because you may be using Firefox on systems with different monitor configurations. As such, synchronizing the settings is not appropriate.
