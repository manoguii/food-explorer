import { nanoid } from 'nanoid'

export class Code {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Code(value)
  }

  static generateUniqueCode(): Code {
    const value = nanoid(8)
    return new Code(value)
  }
}
