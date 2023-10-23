import { Entity } from './entity'
import { UniqueEntityID } from './unique-entity-id'

describe('Entity', () => {
  interface TestProps {
    name: string
    age: number
  }

  class TestEntity extends Entity<TestProps> {
    constructor(props: TestProps, id?: UniqueEntityID) {
      super(props, id)
    }
  }

  it('should generate a unique ID when no ID is provided', () => {
    const entity1 = new TestEntity({ name: 'John', age: 30 })
    const entity2 = new TestEntity({ name: 'Jane', age: 25 })

    expect(entity1.id).not.toEqual(entity2.id)
  })

  it('should set the ID when an ID is provided', () => {
    const id = new UniqueEntityID()
    const entity = new TestEntity({ name: 'John', age: 30 }, id)

    expect(entity.id).toEqual(id)
  })

  it('should return true when comparing the same instance', () => {
    const entity = new TestEntity({ name: 'John', age: 30 })

    expect(entity.equals(entity)).toBe(true)
  })

  it('should return true when comparing two instances with the same ID', () => {
    const id = new UniqueEntityID()
    const entity1 = new TestEntity({ name: 'John', age: 30 }, id)
    const entity2 = new TestEntity({ name: 'Jane', age: 25 }, id)

    expect(entity1.equals(entity2)).toBe(true)
  })

  it('should return false when comparing two instances with different IDs', () => {
    const entity1 = new TestEntity({ name: 'John', age: 30 })
    const entity2 = new TestEntity({ name: 'Jane', age: 25 })

    expect(entity1.equals(entity2)).toBe(false)
  })
})
