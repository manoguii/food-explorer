export class Price {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Price(value)
  }
}
