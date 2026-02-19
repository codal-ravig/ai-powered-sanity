import { defineMigration, patch, set, at } from '@sanity/migrate'
import tinycolor from 'tinycolor2'

function hexToColorObject(hexStr: string) {
  const color = tinycolor(hexStr)
  if (!color.isValid()) return null

  const rgb = color.toRgb()
  const hsl = color.toHsl()
  const hsv = color.toHsv()

  return {
    _type: 'color',
    alpha: rgb.a,
    hex: color.toHexString(),
    hsl: {
      _type: 'hslaColor',
      a: hsl.a,
      h: hsl.h,
      s: hsl.s,
      l: hsl.l,
    },
    hsv: {
      _type: 'hsvaColor',
      a: hsv.a,
      h: hsv.h,
      s: hsv.s,
      v: hsv.v,
    },
    rgb: {
      _type: 'rgbaColor',
      a: rgb.a,
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
    },
  }
}

export default defineMigration({
  title: 'Convert color hex strings to full color objects',
  documentTypes: ['mood'],

  migrate: {
    document(doc, context) {
      const patches = []

      // Check colorStart
      if (typeof doc.colorStart === 'string') {
        const colorObj = hexToColorObject(doc.colorStart)
        if (colorObj) {
          patches.push(at('colorStart', set(colorObj)))
        }
      }

      // Check colorEnd
      if (typeof doc.colorEnd === 'string') {
        const colorObj = hexToColorObject(doc.colorEnd)
        if (colorObj) {
          patches.push(at('colorEnd', set(colorObj)))
        }
      }

      if (patches.length > 0) {
        return patch(doc._id, patches)
      }
    },
  },
})
