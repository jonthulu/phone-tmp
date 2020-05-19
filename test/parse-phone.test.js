import { parsePhone } from '../src/parse-phone.js'
import chai from 'chai'

chai.should()

describe(`helpers.entry.parsePhone`, function() {

  it(`value.full presence results in value being returned unmodified`, () => {

    const value = {
      full: true
    }

    const result = parsePhone(value)

    result.should.exist
    result.should.be.eq(value)
  })

  it(`null results in empty string`, () => {

    parsePhone(null).should.be.eq(``)
  })

  it(`undefined results in empty string`, () => {

    parsePhone(undefined).should.be.eq(``)
  })

  it(`boolean false results in empty string`, () => {

    parsePhone(false).should.be.eq(``)
  })

  it(`+99 999 999 99?99 without extension`, () => {

    const fieldFormat = {
      extension: false,
      format: `+99 999 999 99?99`
    }

    const result = parsePhone(`+12 345 678 90123`, fieldFormat)

    result.should.exist

    result.country.should.exist
    result.country.should.be.eq(`12`)

    result.area.should.exist
    result.area.should.be.eq(`345`)

    result.number.should.exist
    result.number.should.be.eq(`67890123`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890123`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`+12 345 678 90123`)
  })

  it(`+99 999 999 99?99 with extension`, () => {

    const fieldFormat = {
      extension: true,
      format: `+99 999 999 99?99`
    }

    const result = parsePhone(`+12 345 678 90123 x1234`, fieldFormat)

    result.should.exist

    result.country.should.exist
    result.country.should.be.eq(`12`)

    result.area.should.exist
    result.area.should.be.eq(`345`)

    result.number.should.exist
    result.number.should.be.eq(`67890123`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890123`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`+12 345 678 90123 x1234`)

  })

  it(`+99 (0)999 999 99?99 without extension`, () => {

    const fieldFormat = {
      extension: false,
      format: `+99 (0)999 999 99?99`
    }

    const result = parsePhone(`+12 (0)345 678 9123`, fieldFormat)

    result.should.exist

    result.country.should.exist
    result.country.should.be.eq(`12`)

    result.area.should.exist
    result.area.should.be.eq(`203`)

    result.number.should.exist
    result.number.should.be.eq(`456789123`)

    result.full.should.exist
    result.full.should.be.eq(`1203456789123`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`+12 (0)345 678 9123`)
  })

  it(`+99 (0)999 999 99?99 with extension`, () => {

    const fieldFormat = {
      extension: true,
      format: `+99 (0)999 999 99?99`
    }

    const result = parsePhone(`+12 (0)345 678 9123 x1234`, fieldFormat)

    result.should.exist

    result.country.should.exist
    result.country.should.be.eq(`12`)

    result.area.should.exist
    result.area.should.be.eq(`203`)

    result.number.should.exist
    result.number.should.be.eq(`456789123`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1203456789123`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`+12 (0)345 678 9123 x1234`)
  })

  it(`(999) 999-9999 without extension`, () => {

    const fieldFormat = {
      extension: false,
      format: `(999) 999-9999`
    }

    const result = parsePhone(`(123) 456-7890`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`(123) 456-7890`)
  })

  it(`(999) 999-9999 with extension`, () => {

    const fieldFormat = {
      extension: true,
      format: `(999) 999-9999`
    }

    const result = parsePhone(`(123) 456-7890 x1234`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`(123) 456-7890 x1234`)
  })

  it(`(999) 999-9999 without extension just numbers`, () => {

    const fieldFormat = {
      extension: false,
      format: `(999) 999-9999`
    }

    const result = parsePhone(`1234567890`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    // Why is this not formatted?!?!
    result.formatted.should.exist
    result.formatted.should.be.eq(`1234567890`)
  })

  it(`(999) 999-9999 with extension just numbers`, () => {

    const fieldFormat = {
      extension: true,
      format: `(999) 999-9999`
    }

    const result = parsePhone(`1234567890 x1234`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    // Why is this not formatted?!?!
    result.formatted.should.exist
    result.formatted.should.be.eq(`1234567890 x1234`)
  })

  it(`999.999.9999 without extension`, () => {

    const fieldFormat = {
      extension: false,
      format: `999.999.9999`
    }

    const result = parsePhone(`123.456.7890`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`123.456.7890`)
  })

  it(`999.999.9999 with extension`, () => {

    const fieldFormat = {
      extension: true,
      format: `999.999.9999`
    }

    const result = parsePhone(`123.456.7890 x1234`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`123.456.7890 x1234`)
  })

  it(`999.999.9999 without extension just numbers`, () => {

    const fieldFormat = {
      extension: false,
      format: `999.999.9999`
    }

    const result = parsePhone(`1234567890`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    // Why is this not formatted?!?!
    result.formatted.should.exist
    result.formatted.should.be.eq(`1234567890`)
  })

  it(`999.999.9999 with extension just numbers`, () => {

    const fieldFormat = {
      extension: true,
      format: `999.999.9999`
    }

    const result = parsePhone(`1234567890 x1234`, fieldFormat)

    result.should.exist

    result.area.should.exist
    result.area.should.be.eq(`123`)

    result.number.should.exist
    result.number.should.be.eq(`4567890`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    // Why is this not formatted?!?!
    result.formatted.should.exist
    result.formatted.should.be.eq(`1234567890 x1234`)
  })

  it(`99 9999 9999 without extension`, () => {

    const fieldFormat = {
      extension: false,
      format: `99 9999 9999`
    }

    // does not produce an area or country attribute
    const result = parsePhone(`12 3456 7890`, fieldFormat)

    result.should.exist

    // why does number equal same as full?
    result.number.should.exist
    result.number.should.be.eq(`1234567890`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`12 3456 7890`)
  })

  it(`99 9999 9999 with extension`, () => {

    const fieldFormat = {
      extension: true,
      format: `99 9999 9999`
    }

    // does not produce an area or country attribute
    const result = parsePhone(`12 3456 7890 x1234`, fieldFormat)

    result.should.exist

    // why does number equal same as full?
    result.number.should.exist
    result.number.should.be.eq(`1234567890`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`12 3456 7890 x1234`)
  })

  it(`9999 999 999 without extension`, () => {

    const fieldFormat = {
      extension: false,
      format: `9999 999 999`
    }

    const result = parsePhone(`1234 567 890`, fieldFormat)

    result.should.exist

    // why does number equal same as full?
    result.number.should.exist
    result.number.should.be.eq(`1234567890`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`1234 567 890`)
  })

  it(`9999 999 999 with extension`, () => {

    const fieldFormat = {
      extension: true,
      format: `9999 999 999`
    }

    const result = parsePhone(`1234 567 890 x1234`, fieldFormat)

    result.should.exist

    // why does number equal same as full?
    result.number.should.exist
    result.number.should.be.eq(`1234567890`)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    result.full.should.exist
    result.full.should.be.eq(`1234567890`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`1234 567 890 x1234`)
  })

  it(`9999 ??? 999 99 9999 without extension (default case)`, () => {

    const fieldFormat = {
      extension: false,
      format: `9999 ??? 999 99 9999`
    }

    const result = parsePhone(`1234 567 890 12 3456`, fieldFormat)

    result.should.exist

    // why does number equal same as full?
    // why is this one formatted?
    result.number.should.exist
    result.number.should.be.eq(`1234 567 890 12 3456`)

    // why is this one formatted?
    result.full.should.exist
    result.full.should.be.eq(`1234 567 890 12 3456`)

    result.formatted.should.exist
    result.formatted.should.be.eq(`1234 567 890 12 3456`)
  })

  it(`9999 ??? 999 99 9999 with extension (default case)`, () => {

    const fieldFormat = {
      extension: true,
      format: `9999 ??? 999 99 9999`
    }

    const result = parsePhone(`1234 567 890 12 3456 x1234`, fieldFormat)

    result.should.exist

    // why does number equal same as full?
    // why is this one formatted?
    // why is there an extra space at the end of the string?
    result.number.should.exist
    result.number.should.be.eq(`1234 567 890 12 3456 `)

    result.ext.should.exist
    result.ext.should.be.eq(`1234`)

    // why is this one formatted?
    // why is there an extra space at the end of the string?
    result.full.should.exist
    result.full.should.be.eq(`1234 567 890 12 3456 `)

    result.formatted.should.exist
    result.formatted.should.be.eq(`1234 567 890 12 3456 x1234`)
  })
})
