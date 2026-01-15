// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Comando personalizado para preencher o formulário de cadastro
Cypress.Commands.add('preencherCadastro', (usuario) => {
    // Se passar um nome, preenche. Se não, deixa vazio.
    if (usuario.nome) cy.get('input[placeholder="Nome"]').type(usuario.nome)
    
    // Se passar email, preenche
    if (usuario.email) cy.get('input[placeholder="Email"]').type(usuario.email)
    
    // Se passar telefone, preenche
    if (usuario.telefone) cy.get('input[placeholder="Telefone"]').type(usuario.telefone)
    
    // Preenche a cidade (aquele campo extra do bug)
    if (usuario.cidade) cy.get('input[placeholder="Cidade de nascimento"]').type(usuario.cidade)
    
    // Preenche data
    if (usuario.dataNascimento) cy.get('input[type="date"]').type(usuario.dataNascimento)
    
    // Preenche empresas
    if (usuario.empresas) cy.get('input[placeholder="Empresas"]').type(usuario.empresas)
})

// Comando para abrir o modal (para não repetir cy.contains click toda hora)
Cypress.Commands.add('abrirModalCadastro', () => {
    cy.contains('Novo Usuário').should('be.visible').click()
})
// Comando para visitar a Home (útil se a porta 5400 mudar para 3000, por exemplo)
Cypress.Commands.add('acessarHome', () => {
    cy.visit('http://localhost:5400')
    // Garante que carregou
    cy.title().should('include', 'Contato Seguro') 
})
// Comando inteligente para validar colunas de qualquer tabela
Cypress.Commands.add('validarCabecalhosTabela', (listaDeColunas) => {
    // Primeiro garante que a tabela existe
    cy.get('table').should('be.visible')
    
    // Percorre a lista (array) e verifica se cada item existe como cabeçalho (th)
    listaDeColunas.forEach((coluna) => {
        cy.contains('th', coluna).should('be.visible')
    })
})

// Comando para verificar se a aplicação não quebrou (sem erro 500 na tela)
Cypress.Commands.add('validarPaginaSemErros', () => {
    cy.get('body').should('not.contain', 'Internal Server Error')
    cy.get('body').should('not.contain', 'Page not found')
})