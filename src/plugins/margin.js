import _ from 'lodash'

export default function({ negative: isNegative }) {
  const negative = isNegative ? '-' : ''

  return function() {
    return function({ addUtilities, e, theme, variants }) {
      const generators = [
        (size, modifier) => ({
          [`.${e(`${negative}m-${modifier}`)}`]: { margin: `${size}` },
        }),
        (size, modifier) => ({
          [`.${e(`${negative}my-${modifier}`)}`]: {
            'margin-top': `${size}`,
            'margin-bottom': `${size}`,
          },
          [`.${e(`${negative}mx-${modifier}`)}`]: {
            'margin-left': `${size}`,
            'margin-right': `${size}`,
          },
        }),
        (size, modifier) => ({
          [`.${e(`${negative}mt-${modifier}`)}`]: { 'margin-top': `${size}` },
          [`.${e(`${negative}mr-${modifier}`)}`]: { 'margin-right': `${size}` },
          [`.${e(`${negative}mb-${modifier}`)}`]: { 'margin-bottom': `${size}` },
          [`.${e(`${negative}ml-${modifier}`)}`]: { 'margin-left': `${size}` },
        }),
      ]

      const utilities = _.flatMap(generators, generator => {
        if (isNegative) {
          return _.flatMap(theme('negativeMargin'), (size, modifier) => {
            return generator(`${size}` === '0' ? `${size}` : `-${size}`, modifier)
          })
        }

        return _.flatMap(theme('margin'), generator)
      })

      addUtilities(utilities, variants(isNegative ? 'negativeMargin' : 'margin'))
    }
  }
}
