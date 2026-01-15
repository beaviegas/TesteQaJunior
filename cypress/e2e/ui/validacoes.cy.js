describe('Testes de Validação e Segurança (Refatorado com Custom Commands)', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5400')
    cy.abrirModalCadastro()
  })

  it('Não deve permitir cadastrar com campos vazios', () => {

    cy.contains('button', 'Salvar').click()
    cy.contains('button', 'Salvar').should('be.visible')
    cy.get('input[placeholder="Nome"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false
    })

  })

  it('Não deve aceitar e-mail em formato inválido', () => {

    cy.preencherCadastro({
      nome: 'Teste email inválido',
      email: 'email-sem-arroba.com'
    })

    cy.contains('button', 'Salvar').click()

    cy.contains('button', 'Salvar').should('be.visible')
    cy.get('input[placeholder="Email"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false
    })
  })

  it('Não deve aceitar letras no campo Telefone', () => {
   
    cy.preencherCadastro({
      nome: 'Teste Telefone',
      email: 'teste@telefone.com',
      telefone: 'abcde-erro'
    })
    
    cy.contains('button', 'Salvar').click()
    
    cy.get('input[placeholder="Telefone"]').should('have.value', '') 
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Não deve permitir Data de Nascimento no Futuro', () => {
 
    cy.preencherCadastro({
      nome: 'Teste data futura',
      email: 'futuro@teste.com',
      dataNascimento: '2050-01-01'
    })
    
    cy.contains('button', 'Salvar').click()
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Deve validar limite mínimo de caracteres no Nome', () => {
    cy.preencherCadastro({
      nome: 'A',
      email: 'curto@teste.com'
    })
    
    cy.contains('button', 'Salvar').click()
    cy.contains('button', 'Salvar').should('be.visible')
  })
})