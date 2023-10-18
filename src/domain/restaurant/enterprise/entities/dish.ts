import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Price } from './value-objects/price'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { DishAttachmentList } from './dish-attachment-list'
import { DishIngredientList } from './dish-ingredient-list'

export interface DishProps {
  categoryId: UniqueEntityID
  attachments: DishAttachmentList
  ingredients: DishIngredientList
  name: string
  description: string
  price: Price
  slug: Slug
  createdAt: Date
  updatedAt?: Date | null
}

export class Dish extends AggregateRoot<DishProps> {
  get categoryId() {
    return this.props.categoryId
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: DishAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get ingredients() {
    return this.props.ingredients
  }

  set ingredients(ingredients: DishIngredientList) {
    this.props.ingredients = ingredients
    this.touch()
  }

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
    return this.props.price.value
  }

  set price(price: number) {
    this.props.price.value = price
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      DishProps,
      'createdAt' | 'slug' | 'attachments' | 'ingredients'
    >,
    id?: UniqueEntityID,
  ) {
    const dish = new Dish(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        attachments: props.attachments ?? new DishAttachmentList([]),
        ingredients: props.ingredients ?? new DishIngredientList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return dish
  }
}
