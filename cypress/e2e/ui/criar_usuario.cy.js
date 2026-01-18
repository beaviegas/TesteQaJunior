import { fakerPT_BR as faker } from '@faker-js/faker'

describe('Funcionalidade: Cadastro de Usuário', () => {

  let dadosOriginais;

  beforeEach(() => {
    cy.acessarHome()
    cy.intercept('POST', '**/api/user/create').as('requestCadastro')
  })

  it('Validação de cadastro de usuário de correspondência dos dados criados', () => {
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

  it('Validação de campos obrigatórios: campo Nome', () => {
    cy.abrirModalCadastro()
    
    const usuarioSemNome = {
      nome: '',
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.preencherCadastro(usuarioSemNome)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.get('input[placeholder="Nome"]').then(($input) => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.contain('Preencha este campo')
    })
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Validação de campos obrigatórios: campo Email', () => {
    cy.abrirModalCadastro()

    const usuarioSemEmail = {
      nome: faker.person.fullName(),
      email: '',
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.preencherCadastro(usuarioSemEmail)
    cy.contains('button', 'Salvar').click({ force: true })

    cy.get('input[placeholder="Email"]').then(($input) => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.contain('Preencha este campo')
    })
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Validação de campos obrigatórios: campo Telefone', () => {
    cy.abrirModalCadastro()

    const usuarioSemTelefone = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: '',
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.preencherCadastro(usuarioSemTelefone)
    cy.contains('button', 'Salvar').click({ force: true })

    cy.get('input[placeholder="Telefone"]').then(($input) => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.contain('Preencha este campo')
    })
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Validação de campos obrigatórios: Tentar salvar com Data de Nascimento vazia', () => {
    cy.abrirModalCadastro()

    const usuarioSemData = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      empresas: 'Empresa 1',
      dataNascimento: ''
    }

    cy.preencherCadastro(usuarioSemData)
    cy.get('input[type="date"]').clear()
    cy.contains('button', 'Salvar').click({ force: true })
    cy.get('input[type="date"]').then(($input) => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.contain('Preencha este campo')
    })
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Validação de campos obrigatórios: campo Cidade', () => {
    cy.abrirModalCadastro()

    const usuarioSemCidade = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1',
      cidade: ''
    }

    cy.preencherCadastro(usuarioSemCidade)
    cy.get('input[placeholder="Cidade de nascimento"]').clear()
    cy.contains('button', 'Salvar').click({ force: true })

    cy.get('input[placeholder="Cidade de nascimento"]').then(($input) => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.contain('Preencha este campo')
    })
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Validação de campos obrigatórios: select Empresas', () => {
    cy.abrirModalCadastro()

    const usuarioSemEmpresa = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: ''
    }

    cy.preencherCadastro(usuarioSemEmpresa)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.contains('Atenção!').should('be.visible')
    cy.contains('Insira as empresas do usuário!').should('be.visible')
    cy.contains('button', 'OK').click()
    cy.contains('button', 'Salvar').should('be.visible')
  })


  it('Validação formato de e-mail inválido', () => {
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

  it('Validação de máscara no campo Telefone', () => {
    cy.abrirModalCadastro() 
    
    const usuarioTelefoneInvalido = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: 'abcde-erro',
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.preencherCadastro(usuarioTelefoneInvalido)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.get('input[placeholder="Telefone"]').should('have.value', '') 
    cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Validação de limite mínimo de caracteres no campo Nome', () => {
     cy.abrirModalCadastro() 

     const usuarioNomeCurto = {
       nome: 'A',
       email: faker.internet.email(),
       telefone: faker.string.numeric(11),
       cidade: faker.location.city(),
       dataNascimento: '1990-01-01',
       empresas: 'Empresa 1'
     }

     cy.preencherCadastro(usuarioNomeCurto)
     cy.contains('button', 'Salvar').click({ force: true })
     cy.get('input[placeholder="Nome"]').then(($input) => {
        
         expect($input[0].checkValidity()).to.be.false 
     })
     cy.contains('button', 'Salvar').should('be.visible')
  })

  it('Validação da data de nascimento com tratamento de data futura', () => {
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

  it('Pré-condição: Cadastrar Usuário Original para testes de duplicidade', () => {
    
    dadosOriginais = {
      nome: 'Usuário Original',
      email: faker.internet.email(),
      telefone: faker.string.numeric(11),
      cidade: faker.location.city(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
      empresas: 'Empresa 1'
    }

    cy.abrirModalCadastro()
    cy.preencherCadastro(dadosOriginais)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.wait('@requestCadastro')
    cy.contains(dadosOriginais.nome).should('be.visible')
  })

  it('Validação: duplicidade de E-mail', () => {

    if (!dadosOriginais) return;

    cy.abrirModalCadastro()
    const cloneEmail = { ...dadosOriginais, nome: 'Clone Email', telefone: faker.string.numeric(11) }

    cy.preencherCadastro(cloneEmail)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.wait('@requestCadastro').then((intercept) => {
        expect(intercept.response.statusCode).to.be.oneOf([400, 409, 422])
    })
  })

  it('Validação: duplicidade de Telefone', () => {
    if (!dadosOriginais) return;

    cy.abrirModalCadastro()
    const cloneTelefone = { ...dadosOriginais, nome: 'Clone Tel', email: faker.internet.email() }
    cy.preencherCadastro(cloneTelefone)
    cy.contains('button', 'Salvar').click({ force: true })
    cy.wait('@requestCadastro').then((intercept) => {
        expect(intercept.response.statusCode).to.be.oneOf([400, 409, 422])
    })
  })

})