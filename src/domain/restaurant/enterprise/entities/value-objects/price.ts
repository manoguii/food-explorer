export class Price {
  public value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number) {
    return new Price(value)
  }
}
