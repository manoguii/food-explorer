export class Price {
  private readonly amount: number
  private readonly currency: string

  private constructor(amount: number, currency = 'BRL') {
    this.amount = amount // Valor inteiro em centavos
    this.currency = currency // Moeda (padrão: BRL)
  }

  static fromCents(cents: number, currency = 'BRL'): Price {
    return new Price(cents, currency)
  }

  static fromFloat(amount: number, currency = 'BRL'): Price {
    return new Price(Math.round(amount * 100), currency)
  }

  getFormatted(): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.currency,
    })

    return formatter.format(this.amount / 100)
  }

  toCents(): number {
    return this.amount
  }
}
