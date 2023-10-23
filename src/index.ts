import { parse } from 'node-html-parser'
import type { Plugin } from 'vite'

const autoPreload = (): Plugin => {
  return {
    name: 'vite-plugin-auto-preload',
    transformIndexHtml(html, ctx) {
      const root = parse(html)
      const scripts = root.querySelectorAll('script[src]:not([nomodule])')
      const stylesheets = root.querySelectorAll('link[href][rel~="stylesheet"]')
      const preloadTags = root.querySelectorAll('link[href][rel~="preload"]')
      const modulePreloadTags = root.querySelectorAll('link[href][rel~="modulepreload"]')

      const preloadURLs = new Set(preloadTags.map(node => node.getAttribute('href')!))
      const modulePreloadURLs = new Set(modulePreloadTags.map(node => node.getAttribute('href')!))

      const missingModulePreloadURLs = scripts
        .filter(node => node.getAttribute('type') === 'module')
        .map(node => node.getAttribute('src')!)
        .filter(value => !modulePreloadURLs.has(value))

      const missingScriptPreloadURLs = scripts
        .filter(node => node.getAttribute('type') !== 'module')
        .map(node => node.getAttribute('src')!)
        .filter(value => !preloadURLs.has(value))

      const missingStylesheetPreloadURLs = stylesheets
        .map(node => node.getAttribute('href')!)
        .filter(value => !preloadURLs.has(value))

      return {
        html,
        tags: [
          ...missingModulePreloadURLs.map(url => {
            return {
              tag: 'link',
              attrs: {
                rel: 'modulepreload',
                href: url,
                crossorigin: true,
              },
            }
          }),
          ...missingScriptPreloadURLs.map(url => {
            return {
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: url,
                as: 'script',
                crossorigin: true,
              },
            }
          }),
          ...missingStylesheetPreloadURLs.map(url => {
            return {
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: url,
                as: 'style',
                crossorigin: true,
              },
            }
          }),
        ],
      }
    },
  }
}

export default autoPreload
