import { Slug } from './value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface DishProps {
  name: string
  description: string
  price: number
  category: string
  ingredients: string[]
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Dish extends Entity<DishProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.props.slug = Slug.createFromText(name)
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get price() {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
    this.touch()
  }

  get category() {
    return this.props.category
  }

  set category(category: string) {
    this.props.category = category
    this.touch()
  }

  get ingredients() {
    return this.props.ingredients
  }

  set ingredients(ingredients: string[]) {
    this.props.ingredients = ingredients
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.props.description.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DishProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityId,
  ) {
    const dish = new Dish(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: new Date(),
      },
      id,
    )

    return dish
  }
}
