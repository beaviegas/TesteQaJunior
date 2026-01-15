describe('Testes da Página Inicial', () => {
  it('Deve carregar a página e exibir o botão Novo Usuário', () => {
    cy.visit('http://localhost:5400')

    cy.title().should('include', 'Contato Seguro')

    cy.contains('Novo Usuário').should('be.visible')
  })
})