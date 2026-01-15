describe('Automação de API - Cobertura Completa da Documentação', () => {
  const baseUrl = 'http://localhost:8400'
  
  let userId;
  let companyId;


  it('GET - Home)', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('msg', 'home')
    })
  })

  // --- ROTAS DE USUÁRIO (USER) ---
  context('Endpoints de Usuário (/api/user)', () => {
    
    it('POST - Criar um usuário (POST /api/user/create)', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/user/create`,
        failOnStatusCode: false,
        body: {
          "name": "Beatriz QA",
          "e-mail": "beatriz@qa.com",
          "companies": ["Empresa Teste"]
        }
      }).then((response) => {

        expect(response.status).to.eq(201)
     
        if (response.body.id) userId = response.body.id
      })
    })

    it('GET - Deve retornar todos usuários', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/user`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('GET - Deve retornar usuário por id', () => {

      if (userId) {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/api/user/${userId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('id', userId)
        })
      } else {
        cy.log('Teste pulado pois a criação de usuário falhou anteriormente')
      }
    })

    it('PATCH - Editar usuário', () => {
      if (userId) {
        cy.request({
          method: 'PATCH',
          url: `${baseUrl}/api/user/${userId}/update`, // Seguindo a doc
          failOnStatusCode: false,
          body: {
            "name": "Beatriz Editada",
            "e-mail": "beatriz.edit@qa.com",
            "companies": ["Nova Empresa"]
          }
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.name).to.eq('Beatriz Editada')
        })
      }
    })

    it('DELETE - Deve remover usuário', () => {
      if (userId) {
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/api/user/${userId}/delete`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200)
        })
      }
    })
  })


  context('Endpoints de Empresa (/api/company)', () => {

    it('CRIAR - Deve criar uma empresa (POST /api/company/create)', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/company/create`,
        failOnStatusCode: false,
        body: {
          "name": "Empresa QA Ltda",
          "cnpj": "00.000.000/0001-00",
          "adress": { 
             "cep": "90000-000",
             "country": "Brasil",
             "city": "Porto Alegre",
             "street_location": "Rua Fantasma", 
             "number": "0",
             "district": "Centro"
          }
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        if (response.body.id) companyId = response.body.id
      })
    })

    it('GET - Deve retornar todas empresas', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/company`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('GET - Deve retornar empresa por Id', () => {
      if (companyId) {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/api/company/${companyId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200)
        })
      }
    })

    it('PATCH - Deve editar empresa', () => {
      if (companyId) {
        cy.request({
          method: 'PATCH',
          url: `${baseUrl}/api/company/${companyId}/update`,
          failOnStatusCode: false,
          body: {
            "name": "Empresa QA Editada",
            "cnpj": "11.111.111/0001-11",
            "adress": {
               "cep": "91000-000",
               "country": "Brasil",
               "state": "RS", 
               "city": "Canoas",
               "street": "Rua Nova",
               "number": "10",
               "district": "Bairro Novo"
            }
          }
        }).then((response) => {
          expect(response.status).to.eq(200)
        })
      }
    })
  })
})