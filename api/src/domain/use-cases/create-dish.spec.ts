import { CreateDishUseCase } from './create-dish'
import { DishRepository } from '../repositories/dish-repository'
import { Dish } from '../entities/dish'

const fakeDishRepository: DishRepository = {
  create: async (dish: Dish): Promise<void> => {
    return
  },
}

test('Create a new Dish', async () => {
  const createDish = new CreateDishUseCase(fakeDishRepository)

  const dish = await createDish.execute({
    name: 'Tropeiro',
    description: 'Prato mineiro',
    ingredients: ['Bacon', 'Feijão'],
    category: 'Mineiro',
  })

  expect(dish.name).toEqual('Tropeiro')
})
