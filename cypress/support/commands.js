Cypress.Commands.add('preencherCadastro', (usuario) => {

    if (usuario.nome) cy.get('input[placeholder="Nome"]').clear().type(usuario.nome)
    
    if (usuario.email) cy.get('input[placeholder="Email"]').clear().type(usuario.email)
    
    if (usuario.telefone) cy.get('input[placeholder="Telefone"]').clear().type(usuario.telefone)
    
    if (usuario.cidade) cy.get('input[placeholder="Cidade de nascimento"]').clear().type(usuario.cidade)
    
    if (usuario.dataNascimento) cy.get('input[type="date"]').clear().type(usuario.dataNascimento)
    
    if (usuario.empresas) {

       cy.get('input[placeholder="Empresas"]').click()
       cy.contains(usuario.empresas).click({force: true})
    }
})

Cypress.Commands.add('abrirModalCadastro', () => {
    cy.contains('Novo Usuário').should('be.visible').click()
})
Cypress.Commands.add('acessarHome', () => {
    cy.visit('http://localhost:5400')
    cy.title().should('include', 'Contato Seguro') 
})

Cypress.Commands.add('validarCabecalhosTabela', (listaDeColunas) => {
 
    cy.get('table').should('be.visible')
    
    
    listaDeColunas.forEach((coluna) => {
        cy.contains('th', coluna).should('be.visible')
    })
})

Cypress.Commands.add('validarPaginaSemErros', () => {
    cy.get('body').should('not.contain', 'Internal Server Error')
    cy.get('body').should('not.contain', 'Page not found')
})