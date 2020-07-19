# resizeit2

A rewrite (from scratch) of the [ResizeIT Firefox extension](https://addons.mozilla.org/firefox/addon/resizeit/). It wasn’t available as a Web Extension in the past.

I think it’s a great tool, especially with frequently changing monitor setups.

I’ll try to make it compatible with Chrome, too. Eventually.

## Building

This extension is written using TypeScript. To get started, run `npm ci`.

To lint and build, use `npm run lint` and `npm run build`, respectively.

To pack the extension, use `npm run pack`. This command requires a UNIX-style `zip` command to be present in `$PATH`. On Windows, you could use Cygwin or WSL.

## Notes

This extension is using `browser.storage.local`. Why? Because you may be using Firefox on systems with different monitor configurations. As such, synchronizing the settings is not appropriate.
