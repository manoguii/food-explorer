import { randomUUID } from 'crypto'

export class Code {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Code(value)
  }

  static generateUniqueCode(): Code {
    const value = randomUUID().slice(0, 8).toUpperCase()
    return new Code(value)
  }
}
