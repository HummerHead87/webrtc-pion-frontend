import palette from 'google-material-color'
import tinycolor from 'tinycolor2'
import random from 'lodash/random'

const colors = ['Red', 'Deep Purple', 'Light Blue', 'Green', 'Yellow', 'Deep Orange', 'Pink', 'Indigo',
  'Cyan', 'Light Green', 'Amber', 'Brown', 'Purple', 'Blue', 'Teal', 'Lime', 'Orange']

/** Возвращает рандомный цвет из палитры material
 * @returns {String}
 */
function getRandomColor () {
  const index = random(colors.length - 1)
  const shades = palette.palette[colors[index]]

  return shades['300']
}

export function getColor (name, shade = '300') {
  return palette.palette[name][shade]
}

/** Возвращает рандомный цвет, отличный от заданного
 * @param {String} color цвет, который не нужно возвращать
 * @returns {String}
 */
function getOtherColor (color) {
  let result

  while (true) { // eslint-disable-line
    result = getRandomColor()
    if (result !== color) break
  }

  return result
}

/** Задает прозрачность цвету
 * @param {String} color объект или строка с цветом @see https://github.com/bgrins/TinyColor#accepted-string-input
 * @param {Float} [alpha=0.2] прозрачность цвета
 * @returns {String} строка в виде RGBA(xxx, xxx, xxx, xx)
 */
function getTransparentColor (color, alpha = 0.2) {
  return tinycolor(color).setAlpha(alpha).toRgbString()
}

/** Преобразует массив цветов в объект с двумя массивами:
 * borders - для цветов границ и main - для цветов шкалы
 * @param {String[]} colors массив цветов
 */
function generateColorsObject (colors) {
  const main = colors.map(color => getTransparentColor(color))

  return {
    borders: colors,
    main,
  }
}

/** Возвращает палитру с рандомными цветами для чартов
 * @param {Number} length количество цветов
 * @param {Boolean} [borders=false] если true функция вернет объект с двумя массивами цветов:
 * для шкалы (main) и для границ (borders)
 * @returns {String|Object}
 */
export function getRandomPalette (length, borders = false) {
  let result = []

  for (let i = 0; i < length; i++) {
    let color

    if (i === 0) {
      color = getRandomColor()
    } else {
      color = getOtherColor(result[i - 1])
    }

    result.push(color)
  }

  if (borders) {
    result = generateColorsObject(result)
  }

  return result
}

/** Возвращает палитру с цветами для чартов, последовательно из палитры material
 * @param {Number} length количество цветов
 * @param {Boolean} [borders=false] если true функция вернет объект с двумя массивами цветов:
 * для шкалы (main) и для границ (borders)
 * @returns {String|Object}
 */
export function getPalette (length, borders = false) {
  let result = []

  for (let i = 0; i < length; i++) {
    const colorIndex = i % (colors.length - 1)
    const colorName = colors[colorIndex]
    const color = getColor(colorName)

    result.push(color)
  }

  if (borders) {
    result = generateColorsObject(result)
  }

  return result
}
