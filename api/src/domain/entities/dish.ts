import { Slug } from './value-objects/slug'
import { Entity } from '../../core/entities/entity'

interface DishProps {
  name: string
  description: string
  category: string
  ingredients: string[]
  slug: Slug
}

export class Dish extends Entity {
  public name: string
  public description: string
  public ingredients: string[]
  public category: string
  public slug: Slug

  constructor(props: DishProps, id?: string) {
    super(id)

    this.name = props.name
    this.description = props.description
    this.ingredients = props.ingredients
    this.category = props.category
    this.slug = props.slug
  }
}
