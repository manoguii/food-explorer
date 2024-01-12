/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')
const restaurantData = require('./data.js')

const API_BASE_URL = 'http://localhost:3333'
const ADMIN_USER_EMAIL = 'guilhermedavidrk@gmail.com'
const ADMIN_USER_PASSWORD = '123456'

async function createSession() {
  try {
    const response = await axios.post(`${API_BASE_URL}/sessions`, {
      email: ADMIN_USER_EMAIL,
      password: ADMIN_USER_PASSWORD,
    })

    return response.data.user.access_token
  } catch (error) {
    console.error('Erro ao criar sessão:', error)
    throw error
  }
}

async function uploadImage(imagePath, token) {
  const formData = new FormData()
  formData.append(
    'file',
    fs.createReadStream(imagePath),
    path.basename(imagePath),
  )

  const result = await axios.post(`${API_BASE_URL}/attachments`, formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })

  return result.data.attachmentId
}

async function createCategory(name, token) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/categories`,
      { name },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data.category.id
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    throw error
  }
}

async function createDish(categoryId, attachmentId, dishData, token) {
  try {
    const dishBody = {
      ...dishData,
      categoryId,
      attachmentsIds: [attachmentId],
    }

    await axios.post(`${API_BASE_URL}/dishes`, dishBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(`Prato ${dishData.name} criado com sucesso!`)
  } catch (error) {
    console.error('Erro ao criar prato:', error)
    throw error
  }
}

async function seedDatabase() {
  const token = await createSession()

  try {
    const categories = restaurantData.categories.map(
      (category) => category.name,
    )
    const categoryIds = []

    for (let i = 0; i < categories.length; i++) {
      const categoryId = await createCategory(categories[i], token)
      categoryIds.push(categoryId)
    }

    for (let i = 0; i < restaurantData.dishes.length; i++) {
      const imagePath = restaurantData.dishes[i].imagePath
      const attachmentId = await uploadImage(imagePath, token)

      // Seleciona aleatoriamente uma categoria para cada prato
      const randomIndex = Math.floor(Math.random() * categoryIds.length)
      const categoryId = categoryIds[randomIndex]

      await createDish(
        categoryId,
        attachmentId,
        restaurantData.dishes[i],
        token,
      )
    }
  } catch (error) {
    console.error('Erro durante o processo de seeding:', error)
  }
}

seedDatabase()

