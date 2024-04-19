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

      const missingModulePreloadTags = scripts
        .filter(node => node.getAttribute('type') === 'module')
        .filter(node => {
          const url = node.getAttribute('src')
          return url && !modulePreloadURLs.has(url)
        })

      const missingScriptPreloadTags = scripts
        .filter(node => node.getAttribute('type') !== 'module')
        .filter(node => {
          const url = node.getAttribute('src')
          return url && !preloadURLs.has(url)
        })

      const missingStylesheetPreloadTags = stylesheets
        .filter(node => {
          const url = node.getAttribute('href')
          return url && !preloadURLs.has(url)
        })

      return {
        html,
        tags: [
          ...missingModulePreloadTags.map(node => {
            const crossorigin = node.getAttribute('crossorigin')
            return {
              tag: 'link',
              attrs: {
                rel: 'modulepreload',
                href: node.getAttribute('src'),
                ...(crossorigin !== undefined ? { crossorigin } : {}),
              },
            }
          }),
          ...missingScriptPreloadTags.map(node => {
            const crossorigin = node.getAttribute('crossorigin')
            return {
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: node.getAttribute('src'),
                as: 'script',
                ...(crossorigin !== undefined ? { crossorigin } : {}),
              },
            }
          }),
          ...missingStylesheetPreloadTags.map(node => {
            const crossorigin = node.getAttribute('crossorigin')
            return {
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: node.getAttribute('href'),
                as: 'style',
                ...(crossorigin !== undefined ? { crossorigin } : {}),
              },
            }
          }),
        ],
      }
    },
  }
}

export default autoPreload
