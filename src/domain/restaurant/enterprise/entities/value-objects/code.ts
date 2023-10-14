export class Code {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Code(value)
  }
}
