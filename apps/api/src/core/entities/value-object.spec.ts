/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueObject } from './value-object'

describe('ValueObject', () => {
  interface TestProps {
    name: string
    age: number
  }

  class TestValueObject extends ValueObject<TestProps> {
    constructor(props: TestProps) {
      super(props)
    }
  }

  it('should be equal to another instance with the same properties', () => {
    const props = { name: 'John', age: 30 }
    const valueObject1 = new TestValueObject(props)
    const valueObject2 = new TestValueObject(props)

    expect(valueObject1.equals(valueObject2)).toBe(true)
  })

  it('should be different from another instance with different properties', () => {
    const props1 = { name: 'John', age: 30 }
    const props2 = { name: 'Jane', age: 25 }
    const valueObject1 = new TestValueObject(props1)
    const valueObject2 = new TestValueObject(props2)

    expect(valueObject1.equals(valueObject2)).toBe(false)
  })

  it('should be different from null', () => {
    const props = { name: 'John', age: 30 }
    const valueObject = new TestValueObject(props)

    expect(valueObject.equals(null as any)).toBe(false)
  })

  it('should be different from undefined', () => {
    const props = { name: 'John', age: 30 }
    const valueObject = new TestValueObject(props)

    expect(valueObject.equals(undefined as any)).toBe(false)
  })

  it('should be different from another object that is not a ValueObject', () => {
    const props = { name: 'John', age: 30 }
    const valueObject = new TestValueObject(props)

    expect(valueObject.equals(props as any)).toBe(false)
  })
})
