import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

import { Slug } from '@/domain/restaurant/enterprise/entities/value-objects/slug'

import { restaurantData } from './data'

const prisma = new PrismaClient()

async function seed() {
  await prisma.category.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.dish.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  await prisma.category.createMany({
    data: restaurantData.categories,
  })

  const categories = await prisma.category.findMany()

  restaurantData.dishes.map(async (dish) => {
    const randomIndex = Math.floor(Math.random() * categories.length)
    const categoryId = categories[randomIndex].id

    const slug = Slug.createFromText(dish.name).value

    const ingredients = dish.ingredients.map((ingredient) => {
      return { name: ingredient }
    })

    await prisma.dish.create({
      data: {
        name: dish.name,
        price: dish.price,
        description: dish.description,
        slug,
        categoryId,
        ingredients: {
          createMany: {
            data: ingredients,
          },
        },
        attachments: {
          create: {
            title: faker.internet.domainName(),
            url: faker.image.url(),
          },
        },
      },
    })

    return {
      ...dish,
      slug,
      categoryId,
    }
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
