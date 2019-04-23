import _ from 'lodash'

function rename(str) {
  return `negative${str.charAt(0).toUpperCase() + str.slice(1)}`
}

function isNegatable(value) {
  return !isNaN(parseInt(value.trim().charAt(0))) && value !== '0'
}

function negateValues(utility) {
  return _.mapValues(utility, value => {
    if (_.isObjectLike(value)) {
      return negateValues(value)
    }

    return isNegatable(value) ? `-${value}` : value
  })
}

function negateKeys(utility) {
  return _.mapKeys(utility, (value, key) => {
    return `.-${key.slice(1)}`
  })
}

function negate(utilities) {
  return _.isArray(utilities)
    ? utilities.map(negateValues).map(negateKeys)
    : negateKeys(negateValues(utilities))
}

export default function negative(plugin) {
  return function() {
    return ({
      postcss,
      config,
      theme,
      variants,
      e,
      prefix,
      addUtilities,
      addComponents,
      addBase,
      addVariant,
    }) => {
      return plugin({
        postcss,

        config: (path, defaultValue) => config(rename(path), defaultValue),
        theme: (path, defaultValue) => theme(rename(path), defaultValue),
        variants: (path, defaultValue) => variants(rename(path), defaultValue),
        e, // : className => `-${e(className)}`,

        prefix,

        addUtilities: (utilities, options) => addUtilities(negate(utilities), options),

        addComponents,
        addBase,
        addVariant,
      })
    }
  }
}
