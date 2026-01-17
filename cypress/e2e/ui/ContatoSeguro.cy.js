import { fakerPT_BR as faker } from '@faker-js/faker'

describe('Funcionalidade: Cadastro de Usuário', () => {

  beforeEach(() => {
    cy.acessarHome()
  })

  it('Deve cadastrar um novo usuário e validar a correspondência de todos os dados', () => {
    cy.abrirModalCadastro()

    const nomeAleatorio = faker.person.fullName()
    const emailAleatorio = faker.internet.email()
    const dataInput = faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0]
    
    const [ano, mes, dia] = dataInput.split('-')
    const dataTabela = `${dia}/${mes}/${ano}`

    const usuarioCompleto = {
      nome: nomeAleatorio,
      email: emailAleatorio,
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: dataInput,
      empresas: 'Empresa 1'
    }

    cy.preencherCadastro(usuarioCompleto)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0)
    cy.get('table').parents().each(($el) => { 
        cy.wrap($el).scrollTo('bottom', { ensureScrollable: false }) 
    })
    
    cy.contains('tr', usuarioCompleto.nome, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('td').should('contain', usuarioCompleto.telefone)
        cy.get('td').should('contain', usuarioCompleto.email)
        cy.get('td').should('contain', usuarioCompleto.cidade)
        cy.get('td').should('contain', usuarioCompleto.empresas)
        cy.get('td').should('contain', dataTabela)
      })
  })

it('Não deve aceitar e-mail em formato inválido (Preenchendo tudo)', () => {
    cy.abrirModalCadastro() 

    const usuarioComEmailInvalido = {
      nome: faker.person.fullName(),
      email: 'email-sem-arroba.com',
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.preencherCadastro(usuarioComEmailInvalido)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.contains('button', 'Salvar').should('be.visible')
    cy.get('input[placeholder="Email"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false
    })
  })
// Refatorar para adicionar os campos
   it('Não deve aceitar letras no campo Telefone', () => {
    cy.abrirModalCadastro() 
    cy.preencherCadastro({
      nome: 'Teste Telefone',
      email: 'teste@telefone.com',
      telefone: 'abcde-erro'
    })
    
    cy.contains('button', 'Salvar').click()
    
    cy.get('input[placeholder="Telefone"]').should('have.value', '') 
    cy.contains('button', 'Salvar').should('be.visible')
  })

it('Não deve permitir que uma data futura seja persistida no sistema', () => {
    cy.abrirModalCadastro()
    const hoje = new Date()
    const dataNoFuturo = new Date()
    dataNoFuturo.setFullYear(hoje.getFullYear() + 1)
    
    const dataFuturaInput = dataNoFuturo.toISOString().split('T')[0]

    const usuarioFuturo = {
      nome: `Bug Data Futura ${faker.person.firstName()}`,
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      empresas: 'Empresa 1',
      dataNascimento: dataFuturaInput
    }

    cy.preencherCadastro(usuarioFuturo)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0)
    cy.get('table').parents().each(($el) => { cy.wrap($el).scrollTo('bottom', { ensureScrollable: false }) })
    
    cy.contains('tr', usuarioFuturo.nome)
      .should('be.visible')
      .find('td')
      .eq(3)
      .invoke('text')
      .then((dataNaTabela) => {
          
          const [dia, mes, ano] = dataNaTabela.split('/')
          const dataSalva = new Date(ano, mes - 1, dia)
          const hojeZerado = new Date()
          hojeZerado.setHours(0,0,0,0)
          expect(dataSalva).to.be.lte(hojeZerado, `ERRO CRÍTICO: O sistema aceitou data futura! (${dataNaTabela})`)
      })
  })

  //Refatorar todos os campos
    it('Deve validar limite mínimo de caracteres no Nome', () => {
      cy.abrirModalCadastro() 
      cy.preencherCadastro({
      nome: 'A',
      email: 'curto@teste.com'
    })
    
    cy.contains('button', 'Salvar').click()
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Não deve permitir cadastrar com campos vazios', () => {

    cy.contains('button', 'Salvar').click()
    cy.contains('button', 'Salvar').should('be.visible')
    cy.get('input[placeholder="Nome"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false
    })

  })

  //Cenário mapeado: cadastro repetido, adicionar teste
})