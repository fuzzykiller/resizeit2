# resizeit2

A rewrite (from scratch) of the [ResizeIT Firefox extension](https://addons.mozilla.org/firefox/addon/resizeit/). <s>It hasn’t been updated in years and is not compatible with Firefox 57+.</s>

I think it’s a great tool, especially with frequently changing monitor setups.

I’ll try to make it compatible with Chrome, too. Eventually.

## Building

This extension is written using TypeScript. To get started, run `npm install` or `yarn`.

To build and check for type errors, use `npm run build` or `yarn run build` (`yarn build` should work, too).

To pack the extension, use `npm run pack` or `yarn run pack`. This command requires a UNIX-style `zip` command to be present in `$PATH`.