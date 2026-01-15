describe('Automação de API - Cobertura Completa da Documentação', () => {
  // ATENÇÃO: Confirme a porta do backend. Geralmente é 3001 ou 3000.
  const baseUrl = 'http://localhost:8400'
  
  // Variáveis para guardar os IDs criados e usar nos testes de Edição/Deleção
  let userId;
  let companyId;

  // --- ROTA HOME ---
  it('HOME - Deve retornar mensagem de home (GET /)', () => {
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
    
    it('CRIAR - Deve criar um usuário (POST /api/user/create)', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/user/create`, // Seguindo a doc
        failOnStatusCode: false,
        body: {
          "name": "Beatriz QA",
          "e-mail": "beatriz@qa.com", // Doc pede "e-mail" (com traço)
          "companies": ["Empresa Teste"]
        }
      }).then((response) => {
        // Se der 404 ou 405, é bug (rota não existe ou método proibido)
        expect(response.status).to.eq(201)
        // Salva o ID para os próximos testes
        if (response.body.id) userId = response.body.id
      })
    })

    it('LISTAR - Deve retornar todos usuários (GET /api/user)', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/user`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('BUSCAR POR ID - Deve retornar usuário específico (GET /api/user/{id})', () => {
      // Só roda se tiver criado o usuário antes
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

    it('ATUALIZAR - Deve editar usuário (PATCH /api/user/{id}/update)', () => {
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

    it('DELETAR - Deve remover usuário (DELETE /api/user/{id}/delete)', () => {
      if (userId) {
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/api/user/${userId}/delete`, // Seguindo a doc
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200)
        })
      }
    })
  })

  // --- ROTAS DE EMPRESA (COMPANY) ---
  context('Endpoints de Empresa (/api/company)', () => {

    it('CRIAR - Deve criar uma empresa (POST /api/company/create)', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/company/create`,
        failOnStatusCode: false,
        body: {
          "name": "Empresa QA Ltda",
          "cnpj": "00.000.000/0001-00",
          "adress": { // Doc escreve "adress" com um D só (Erro de inglês na doc)
             "cep": "90000-000",
             "country": "Brasil",
             "city": "Porto Alegre",
             "street_location": "Rua Fantasma", // Doc pede street_location
             "number": "0",
             "district": "Centro"
          }
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        if (response.body.id) companyId = response.body.id
      })
    })

    it('LISTAR - Deve retornar todas empresas (GET /api/company)', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/company`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('BUSCAR POR ID - Deve retornar empresa específica (GET /api/company/{id})', () => {
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

    it('ATUALIZAR - Deve editar empresa (PATCH /api/company/{id}/update)', () => {
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
               "state": "RS", // Doc pede "state" aqui (não tinha no create)
               "city": "Canoas",
               "street": "Rua Nova", // Doc pede "street" (antes era street_location)
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