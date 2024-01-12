const restaurantData = {
  categories: [
    { name: 'Sobremesas' },
    { name: 'Refeições' },
    { name: 'Saladas' },
    { name: 'Bebidas' },
    { name: 'Massas' },
    { name: 'Carnes' },
  ],
  dishes: [
    {
      name: 'Lasanha à Bolonhesa',
      description: 'Camadas de massa intercaladas com molho de carne e queijo gratinado no forno a lenha e servido com molho branco e molho de tomate.',
      price: 15.99,
      ingredients: ['Massa de lasanha', 'Molho bolonhesa', 'Queijo', 'Presunto', 'Molho branco', 'Molho de tomate'],
      imagePath: './images/dish-1.png'
    },
    {
      name: 'Lasanha de Frango',
      description: 'Camadas de massa intercaladas com molho de frango e queijo gratinado no forno a lenha e servido com molho branco e molho de tomate.',
      price: 14.99,
      ingredients: ['Massa de lasanha', 'Molho de frango', 'Queijo', 'Presunto', 'Molho branco', 'Molho de tomate'],
      imagePath: './images/dish-2.png'
    },
    {
      name: 'Lasanha de Berinjela',
      description: 'Camadas de massa intercaladas com molho de berinjela e queijo gratinado no forno a lenha e servido com molho branco e molho de tomate.',
      price: 13.99,
      ingredients: ['Massa de lasanha', 'Molho de berinjela', 'Queijo', 'Presunto', 'Molho branco', 'Molho de tomate'],
      imagePath: './images/dish-3.png'
    },
    {
      name: 'Lasanha de Palmito',
      description: 'Camadas de massa intercaladas com molho de palmito e queijo gratinado no forno a lenha e servido com molho branco e molho de tomate.',
      price: 14.99,
      ingredients: ['Massa de lasanha', 'Molho de palmito', 'Queijo', 'Presunto', 'Molho branco', 'Molho de tomate'],
      imagePath: './images/dish-5.png'
    },
    {
      name: 'Sushi de Salmão',
      description: 'Rolinho de arroz coberto com fatia de salmão fresco e servido com wasabi e shoyu na lateral do prato.',
      price: 9.99,
      ingredients: ['Arroz de sushi', 'Salmão fresco', 'Alga nori', 'Wasabi', 'Shoyu'],
      imagePath: './images/dish-2.png'
    },
    {
      name: 'Burrito de Frango',
      description: 'Tortilha de trigo recheada com frango desfiado e queijo e servida com molho de tomate e molho branco à parte.',
      price: 11.99,
      ingredients: ['Tortilha de trigo', 'Frango desfiado', 'Queijo', 'Molho de tomate', 'Molho branco'],
      imagePath: './images/dish-3.png'
    },
    {
      name: 'Picanha na Chapa',
      description: 'Picanha grelhada com alho e sal e servida com farofa e vinagrete à parte.',
      price: 29.99,
      ingredients: ['Picanha', 'Alho', 'Sal', 'Farofa', 'Vinagrete'],
      imagePath: './images/dish-4.png'
    },
    {
      name: 'Feijoada',
      description: 'Feijoada completa com arroz, couve, farofa, torresmo, laranja e bisteca.',
      price: 19.99,
      ingredients: ['Feijão preto', 'Arroz', 'Couve', 'Farofa', 'Torresmo', 'Laranja', 'Bisteca'],
      imagePath: './images/dish-5.png'
    },
    {
      name: 'Yakisoba',
      description: 'Macarrão oriental com legumes e frango em cubos e servido com molho shoyu à parte.',
      price: 14.99,
      ingredients: ['Macarrão oriental', 'Legumes', 'Frango', 'Shoyu'],
      imagePath: './images/dish-6.png'
    },
    {
      name: 'Yakissoba de Carne',
      description: 'Macarrão oriental com legumes e carne em cubos e servido com molho shoyu à parte.',
      price: 15.99,
      ingredients: ['Macarrão oriental', 'Legumes', 'Carne', 'Shoyu'],
      imagePath: './images/dish-7.png'
    },
    {
      name: 'Yakissoba de Frutos do Mar',
      description: 'Macarrão oriental com legumes e frutos do mar e servido com molho shoyu à parte.',
      price: 16.99,
      ingredients: ['Macarrão oriental', 'Legumes', 'Frutos do mar', 'Shoyu'],
      imagePath: './images/dish-8.png'
    },
    {
      name: 'Yakissoba Vegetariano',
      description: 'Macarrão oriental com legumes e servido com molho shoyu à parte.',
      price: 13.99,
      ingredients: ['Macarrão oriental', 'Legumes', 'Shoyu'],
      imagePath: './images/dish-9.png'
    },
    {
      name: 'Tikka Masala',
      description: 'Frango em cubos com molho de tomate e especiarias indianas, servido com arroz basmati e pão naan.',
      price: 17.99,
      ingredients: ['Frango', 'Molho de tomate', 'Especiarias', 'Arroz basmati', 'Pão naan'],
      imagePath: './images/dish-5.png'
    },
    {
      name: 'Ratatouille',
      description: 'Legumes frescos assados com azeite de oliva e ervas finas e servidos com molho de tomate e molho branco à parte.',
      price: 12.99,
      ingredients: ['Abobrinha', 'Berinjela', 'Pimentão', 'Cebola', 'Molho de tomate', 'Molho branco', 'Azeite de oliva', 'Ervas finas'],
      imagePath: './images/dish-6.png'
    },
    {
      name: 'Creme de Aspargos',
      description: 'Creme de aspargos frescos com creme de leite e sal a gosto e servido com torradas.',
      price: 8.99,
      ingredients: ['Aspargos', 'Creme de leite', 'Sal', 'Torradas', 'Azeite de oliva'],
      imagePath: './images/dish-7.png'
    },
    {
      name: 'Creme de Abóbora',
      description: 'Creme de abóbora com creme de leite e sal a gosto e servido com torradas.',
      price: 7.99,
      ingredients: ['Abóbora', 'Creme de leite', 'Sal', 'Torradas', 'Azeite de oliva'],
      imagePath: './images/dish-8.png'
    },
    {
      name: 'Creme de Palmito',
      description: 'Creme de palmito com creme de leite e sal a gosto e servido com torradas.',
      price: 9.99,
      ingredients: ['Palmito', 'Creme de leite', 'Sal', 'Torradas'],
      imagePath: './images/dish-9.png'
    },
    {
      name: 'Creme de Mandioquinha',
      description: 'Creme de mandioquinha com creme de leite e sal a gosto e servido com torradas e azeite de oliva à parte.',
      price: 8.99,
      ingredients: ['Mandioquinha', 'Creme de leite', 'Sal'],
      imagePath: './images/dish-10.png'
    },
    {
      name: 'Creme de Ervilha',
      description: 'O tradicional creme de ervilha com creme de leite e sal a gosto e servido com torradas.',
      price: 7.99,
      ingredients: ['Ervilha', 'Creme de leite', 'Sal', 'Torradas'],
      imagePath: './images/dish-11.png'
    },
    {
      name: 'Creme de Cebola',
      description: 'Creme de cebola com creme de leite e sal a gosto e servido com torradas.',
      price: 7.99,
      ingredients: ['Cebola', 'Creme de leite', 'Sal', 'Torradas'],
      imagePath: './images/dish-12.png'
    },
  ],
}

module.exports = restaurantData
