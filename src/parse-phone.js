// Doesn't follow the js standard of only naming using capitalization if it is a class.
import Debug from 'debug'

// I prefer never to use two variable names that are only differentiated by capitalization.
// I would probably import as debugSetup or something similar.
// But this isn't used anyway, so can we just remove it (not sure if this adds a debug line indicating that this file was loaded or not).
const debug = Debug(`phonetmp.core.helpers.entry.parsePhone`)

// The name of this regex is not at all descriptive of what it is doing.
const phoneRegex = new RegExp(/[^0-9]+/, `g`)
// Instead of passing the regex around without context. It might be easier to read if you passed a function.
// const cleanPhoneNumber = (phoneNumber) => String(phoneNumber).replace(phoneRegexp, ``)

// Add jsdoc to explain this function.
// Change val to value in order to be explicit.
export const parsePhone = (val, format) => {

  if (!val) {

    // We have an inconsistent return here. I would probably either return null or throw an error.
    return ``
  }

  // That comment doesn't make much sense to me. Maybe something like - If the value has already been parsed, then just return it.
  // Based on this code, because you defined formatted when you defined phone, it is the most reliable value to check for instead of full.
  // check for parts in case this is a copied value
  if (val.full) {

    return val
  }

  // I prefer not to augment to the arguments given to the function as it can cause issues in certain cases.
  val = String(val)

  const phone = {
    formatted: val
  }

  // const [phoneNumber, ext] = val.split(`x`); Keeps it explicit instead of passing parts around.
  const parts = val.split(`x`)
  const ext = parts[1]

  if (ext) {

    phone.ext = ext
  }

  // You didn't validate that format existed or that it has a .format property before doing this.
  // You should also cast the format to a string `String(format.format)`
  switch (format.format) {

    // I would move all these case logic block to their own functions to make this easier to follow.
    // Ideally case blocks would never be large enough to justify the added scope `{}` to them.
    case `+99 999 999 99?99`:
    case `+99 (0)999 999 99?99`: {
      // I wouldn't use the variable name number since Number is a global. Better to be explicit about what kind of number.
      const number = String(parts[0]).replace(phoneRegex,``)

      phone.full = number

      // Although I love substr, according to MDN it is legacy now and should be avoided.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
      // I would change it to `number.slice(0, 2)`

      // Also substr always returns a string, so we don't need to re-cast it.

      // Since number was already cleaned, it is unnecessary to clean this output, which would be more obvious if
      // the cleanPhoneNumber() function was used instead of a random regexp.

      // On a side note, this doesn't do any kind of check to validate that the number actually matches the format.
      // If that is handled elsewhere then great, but if not then I would probably at the top of this function.
      phone.country = String(number.substr(0, 2)).replace(phoneRegex,``)

      // I don't love that we are kind of doing a sub-case here. Two separate cases with common function logic
      // for all the previous code would probably be better.
      if (format.format === `+99 (0)999 999 99?99`) {
        // These really need to be commented such as 'Area is the (0)999, and so should look like 0999'.
        // Are these substr arguments right? I am not familiar with the phone formats, but area would be 909, which must be wrong.
        // I am not sure if the (0) means 0 is optional which we aren't accounting for here, but if we expect it to
        // not be there, then the substr values (3, 3) and then (6).
        phone.area = number.substr(1, 3)
        phone.number = number.substr(4)
      } else {

        phone.area = number.substr(2, 3)
        phone.number = number.substr(5)
      }

      break
    }
    case `(999) 999-9999`:
    case `999.999.9999`: {

      // This comment is incorrect and should be removed.
      // split extension
      const number = String(parts[0]).replace(phoneRegex,``)

      phone.full = number
      phone.number = number

      // This is always true and can be removed.
      if (number.length === 10) {

        phone.number = number.substr(3)
        phone.area = number.substr(0, 3)
      }

      break
    }
    case `99 9999 9999`:
    case `9999 999 999`: {

      const number = String(parts[0]).replace(phoneRegex,``)

      // I prefer not to do multiple assigns on the same line as it can cause confusion.
      phone.full = phone.number = number

      break
    }
    // This newline is inconsistent with the other case statements.

    default: {

      // It seems like you would want to clean this number too, since you always expect only digits from the other responses.
      const number = parts[0]

      // I prefer not to do multiple assigns on the same line as it can cause confusion.
      phone.full = phone.number = number

      break
    }
  }

  return phone
}
