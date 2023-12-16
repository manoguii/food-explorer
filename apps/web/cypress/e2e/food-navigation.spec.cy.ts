describe('Food', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-in')

    cy.get('input[name="email"]').type('johndoe@gmail.com')

    cy.get('input[name="password"]').type('john-password')

    cy.contains('button', 'Entrar').click()
  })

  it('should be able to navigate to dish page', () => {
    cy.contains('Ver menu').click()

    cy.get('input[id="search"]').type('Pizza')

    cy.get('ul li').should('have.length', 1)
    cy.get('ul li h4').should('contain', 'Pizza')
  })

  it('should be able to navigate to favorite dishes page', () => {
    cy.contains('Meus favoritos').click()

    cy.url().should('contain', '/food/favorites')
  })
})
