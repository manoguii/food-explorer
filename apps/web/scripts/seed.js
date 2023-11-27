const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")
const path = require("path")
const restaurantData = require("./data.js")

const baseUrl = "http://localhost:3333"

async function createUser() {
  try {
    const response = await axios.post(`${baseUrl}/accounts`, {
      name: "Guilherme David",
      email: "guilhermedavid@gmail.com",
      password: "123456",
    })

    return response.data.user
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    throw error
  }
}

async function createSession() {
  try {
    const response = await axios.post(`${baseUrl}/sessions`, {
      email: "guilhermedavid@gmail.com",
      password: "123456",
    })

    return response.data.user.access_token
  } catch (error) {
    console.error("Erro ao criar sessão:", error)
    throw error
  }
}

async function uploadImage(imagePath, token) {
  const formData = new FormData()
  formData.append(
    "file",
    fs.createReadStream(imagePath),
    path.basename(imagePath)
  )

  const result = await axios.post(`${baseUrl}/attachments`, formData, {
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
      `${baseUrl}/categories`,
      { name },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data.category.id
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
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

    await axios.post(`${baseUrl}/dishes`, dishBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(`Prato ${dishData.name} criado com sucesso!`)
  } catch (error) {
    console.error("Erro ao criar prato:", error)
    throw error
  }
}
async function seedDatabase() {
  await createUser()
  const token = await createSession()
  try {
    const categories = restaurantData.categories.map(
      (category) => category.name
    )
    const categoryIds = []

    for (let i = 0; i < categories.length; i++) {
      const categoryId = await createCategory(categories[i], token)
      categoryIds.push(categoryId)
    }

    for (let i = 0; i < restaurantData.dishes.length; i++) {
      const imagePath = path.resolve(__dirname, `images/dish-${i + 1}.png`)
      const attachmentId = await uploadImage(imagePath, token)

      // Seleciona aleatoriamente uma categoria para cada prato
      const randomIndex = Math.floor(Math.random() * categoryIds.length)
      const categoryId = categoryIds[randomIndex]

      await createDish(
        categoryId,
        attachmentId,
        restaurantData.dishes[i],
        token
      )
    }
  } catch (error) {
    console.error("Erro durante o processo de seeding:", error)
  }
}

seedDatabase()
