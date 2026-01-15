describe('Home Page - Contato Seguro', () => {
  it('Deve carregar a página principal e visualizar elementos', () => {
    cy.acessarHome()

    cy.contains('Novo Usuário').should('be.visible')
  })
})