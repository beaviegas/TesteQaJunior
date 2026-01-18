import { fakerPT_BR as faker } from '@faker-js/faker'

describe('Automação de API - Contato Seguro', () => {
  
  let userId;
  let companyId;

  const userData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    companies: ['Empresa Teste API']
  }

  const companyData = {
    name: faker.company.name(),
    cnpj: faker.string.numeric(14),
    adress: {
      cep: faker.location.zipCode(),
      country: "Brasil",
      city: faker.location.city(),
      street: faker.location.street(),
      number: faker.string.numeric(3),
      district: "Centro"
    }
  }

  it('Health Check - API deve estar online', () => {
    cy.request({
      method: 'GET',
      url: '/',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('msg', 'home')
    })
  })

  //Refatorar compos:
  context('Endpoints de Usuário (/api/user)', () => {

    it('POST - Criar um usuário', () => {
      cy.request({
        method: 'POST',
        url: '/api/user/create',
        failOnStatusCode: false,
        body: {
          "name": userData.name,
          "e-mail": userData.email,
          "companies": userData.companies
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('id')
        expect(response.body.name).to.eq(userData.name)

        userId = response.body.id
        cy.log(`Usuário criado com ID: ${userId}`)
      })
    })

    it('GET - Listar todos os usuários', () => {
      cy.request({
        method: 'GET',
        url: '/api/user',
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('GET - Buscar usuário específico por ID', () => {
      if (!userId) throw new Error('ID do usuário não encontrado. O teste de criação falhou?')

      cy.request({
        method: 'GET',
        url: `/api/user/${userId}`,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('id', userId)
        expect(response.body).to.have.property('email', userData.email)
      })
    })

    //refatorar campos
    it('PATCH - Editar usuário', () => {
      if (!userId) throw new Error('ID do usuário não encontrado.')

      const novoNome = `Editado ${faker.person.firstName()}`

      cy.request({
        method: 'PATCH',
        url: `/api/user/${userId}/update`,
        body: {
          "name": novoNome,
          "e-mail": userData.email,
          "companies": ["Nova Empresa S.A."]
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.name).to.eq(novoNome)
      })
    })

    it('DELETE - Remover usuário', () => {
      if (!userId) throw new Error('ID do usuário não encontrado.')

      cy.request({
        method: 'DELETE',
        url: `/api/user/${userId}/delete`,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204])
      })
    })

    it('Validação Extra: Garantir que o usuário foi deletado (404)', () => {
        cy.request({
            method: 'GET',
            url: `/api/user/${userId}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.not.eq(200) 
        })
    })
  })

  context('Endpoints de Empresa (/api/company)', () => {

    it('POST - Criar uma empresa', () => {
      cy.request({
        method: 'POST',
        url: '/api/company/create',
        failOnStatusCode: false,
        body: companyData
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('id')
        
        companyId = response.body.id
        cy.log(`Empresa criada com ID: ${companyId}`)
      })
    })

    it('GET - Listar empresas', () => {
      cy.request('GET', '/api/company').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('GET - Buscar empresa por ID', () => {
      if (!companyId) throw new Error('ID da empresa não encontrado.')

      cy.request('GET', `/api/company/${companyId}`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.id).to.eq(companyId)
      })
    })

    //verificar refatoração de campos
    it('PATCH - Editar empresa', () => {
      if (!companyId) throw new Error('ID da empresa não encontrado.')

      const novoEndereco = {
        ...companyData.adress, 
        city: "Canoas",       
        street: "Rua Nova"     
      }

      cy.request({
        method: 'PATCH',
        url: `/api/company/${companyId}/update`,
        body: {
          name: companyData.name,
          cnpj: companyData.cnpj,
          adress: novoEndereco
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })
})