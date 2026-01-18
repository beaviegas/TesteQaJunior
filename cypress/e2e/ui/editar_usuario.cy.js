import { fakerPT_BR as faker } from '@faker-js/faker'

describe('Funcionalidade: Edição de Usuário', () => {

  let usuarioParaEditar;

  beforeEach(() => {
    cy.acessarHome()

    usuarioParaEditar = {
      nome: 'User Teste Edicao ' + faker.person.firstName(),
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.abrirModalCadastro()
    cy.preencherCadastro(usuarioParaEditar)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.get('table').parents().each(($el) => { 
        cy.wrap($el).scrollTo('bottom', { ensureScrollable: false }) 
    })
    cy.contains(usuarioParaEditar.nome).should('be.visible')
  })

  it('Validação modal de edição', () => {

    cy.contains('tr', usuarioParaEditar.nome)
      .find('button')
      .first()
      .click()
    cy.get('div[role="dialog"]', { timeout: 5000 }).should('be.visible')

  })
})