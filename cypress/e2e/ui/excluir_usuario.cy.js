import { fakerPT_BR as faker } from '@faker-js/faker'

describe('Funcionalidade: Exclusão de Usuário', () => {

  let usuarioParaExcluir;

  beforeEach(() => {
    cy.acessarHome()

    usuarioParaExcluir = {
      nome: 'User Delete ' + faker.person.firstName(),
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.abrirModalCadastro()
    cy.preencherCadastro(usuarioParaExcluir)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.get('table').parents().each(($el) => { 
        cy.wrap($el).scrollTo('bottom', { ensureScrollable: false }) 
    })
    cy.contains(usuarioParaExcluir.nome).should('be.visible')
  })

  it('Deve excluir um usuário e garantir que ele foi removido da lista', () => {

    cy.contains('tr', usuarioParaExcluir.nome)
      .find('button')
      .eq(1)
      .click()

    cy.contains('Sucesso!').should('be.visible')
    cy.contains('Usuário deletado com sucesso!').should('be.visible')
    cy.contains('button', 'OK').click()
    cy.contains('Sucesso!').should('not.exist')
    cy.contains('tr', usuarioParaExcluir.nome).should('not.exist')
  })
})