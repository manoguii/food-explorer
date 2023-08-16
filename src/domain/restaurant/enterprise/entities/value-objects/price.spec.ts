import { Price } from './price'

describe('Price Class', () => {
  it('should be able to creating price from cents', () => {
    const price = Price.fromCents(1299)

    expect(price.toCents()).toBe(1299)
  })

  it('should be able to creating price from float', () => {
    const price = Price.fromFloat(9.99)

    expect(price.toCents()).toBe(999)
  })

  it('should be able to formatting price', () => {
    const price = Price.fromCents(1999)

    const formattedPrice = price.getFormatted()
    const value = formattedPrice.includes('19,99')

    expect(value).toBeTruthy()
  })
})
