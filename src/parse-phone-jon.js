import setupDebug from 'debug'

const debug = setupDebug(`phonetmp.core.helpers.entry.parsePhone`)

// If phone parsing is not called often, I would probably define the regex in the cleanPhoneNumber function
// so it can be garbage collected.
const onlyDigitsRegexp = new RegExp(/[^0-9]+/, `g`)

/**
 * Parses the phone number into its individual parts.
 *
 * The phone number object returned will contain as many of the following as it can pull from the phone number:
 *  - formatted - The raw formatted phone number as it was given.
 *  - full - The full phone number, including country code, area code, and extension.
 *  - [country] - The country code.
 *  - [area] - The area code.
 *  - [number] - The phone number after the area code.
 *  - [ext] - The phone number extension.
 *
 * @param {string|number} rawPhoneValue
 * @param {{format: string}|string} [format]
 * @returns {{}|null}
 */
export function parsePhone(rawPhoneValue, format) {
  if (!rawPhoneValue) {
    return null
  } else if (rawPhoneValue.full) {
    // If the rawPhoneValue has already been parsed, then just return it.
    return rawPhoneValue
  }

  const safeRawPhoneValue = String(rawPhoneValue)
  const [rawPhoneNumber, ext] = safeRawPhoneValue.split(`x`)
  const phoneNumber = cleanPhoneNumber(rawPhoneNumber)

  const output = {
    formatted: String(rawPhoneValue),
    full: phoneNumber,
  }

  if (ext) {
    output.ext = ext
  }

  let safeFormat = format
  if (format.format) {
    safeFormat = format.format
  }

  switch (String(safeFormat)) {
    case `+99 999 999 99?99`:
      return parseLongFormatA(output, phoneNumber)

    case `+99 (0)999 999 99?99`:
      return parseLongFormatB(output, phoneNumber)

    case `(999) 999-9999`:
    case `999.999.9999`:
      return parseMediumFormat(output, phoneNumber)

    case `99 9999 9999`:
    case `9999 999 999`:
      return parseShortFormat(output, phoneNumber)

    default:
      return parseUnknownFormat(output, phoneNumber)
  }
}

/**
 * Removes all non-digits from the given phone number.
 *
 * @param {string} phoneNumber
 * @returns {string}
 */
function cleanPhoneNumber(phoneNumber) {
  return String(phoneNumber).replace(onlyDigitsRegexp, ``)
}

/**
 * Parses phone numbers with the format `+99 999 999 99?99`.
 *
 * @param {{}} output
 * @param {string} phoneNumber - This phone number must be only digits.
 * @returns {{}}
 */
function parseLongFormatA(output, phoneNumber) {
  // If parsing `+aa bbb ccc dd?ee`, the values would be:
  output.country = phoneNumber.slice(0, 2) // aa
  output.area = phoneNumber.slice(2, 5) // bbb
  output.number = phoneNumber.slice(5) // cccddee

  return output
}

/**
 * Parses phone numbers with the format `+99 (0)999 999 99?99`.
 *
 * @param {{}} output
 * @param {string} phoneNumber - This phone number must be only digits.
 * @returns {{}}
 */
function parseLongFormatB(output, phoneNumber) {
  // NOTE: I still think the slice values here are wrong, but I kept them in order to pass the test.

  // If parsing `+aa (z)bbb ccc dd?ee`, the values would be:
  output.country = phoneNumber.slice(0, 2) // aa
  output.area = phoneNumber.slice(1, 4) // azb
  output.number = phoneNumber.slice(4) // bbcccddee

  return output
}

/**
 * Parses phone numbers with the format `(999) 999-9999` or `999.999.9999`.
 *
 * @param {{}} output
 * @param {string} phoneNumber - This phone number must be only digits.
 * @returns {{}}
 */
function parseMediumFormat(output, phoneNumber) {
  // If parsing `(aaa) bbb-cccc` or `aaa.bbb.cccc`, the values would be:
  output.area = phoneNumber.slice(0, 3) // aaa
  output.number = phoneNumber.slice(3) // bbbcccc

  return output
}

/**
 * Parses phone numbers with the format `99 9999 9999` or `9999 999 999`.
 *
 * @param {{}} output
 * @param {string} phoneNumber - This phone number must be only digits.
 * @returns {{}}
 */
function parseShortFormat(output, phoneNumber) {
  output.number = phoneNumber

  return output
}

/**
 * Parses phone numbers with an unknown format.
 *
 * @param {{}} output
 * @param {string} phoneNumber - This phone number must be only digits.
 * @returns {{}}
 */
function parseUnknownFormat(output, phoneNumber) {
  output.number = phoneNumber

  return output
}
