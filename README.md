# vite-plugin-auto-preload

[![npm](https://img.shields.io/npm/v/vite-plugin-auto-preload.svg)](https://www.npmjs.com/package/vite-plugin-auto-preload)

Vite plugin for adding preload resource hints in HTML.

Preload or module preload links are always generated at the end of head. You can refer to [`vite-plugin-html-sort-tags`](https://github.com/CyanSalt/vite-plugin-html-sort-tags) if you want to optimize the sorting.

Also see [`vite-plugin-prefetch-chunk`](https://github.com/CyanSalt/vite-plugin-prefetch-chunk) if you want to generate prefetch links.

## Installation

```shell
npm install --save-dev vite-plugin-auto-preload
```

## Usage

```js
// vite.config.js
import autoPreload from 'vite-plugin-auto-preload'

export default {
  plugins: [
    autoPreload(),
  ],
}
```
