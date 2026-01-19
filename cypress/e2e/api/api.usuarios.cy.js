import { fakerPT_BR as faker } from '@faker-js/faker'

describe('API - Gestão de Usuários', () => {

    let userId;

    const userData = {
        name: 'Teste API' + faker.person.fullName(),
        email: faker.internet.email(),
        telephone: faker.string.numeric(11),
        birth_date: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
        birth_city: faker.location.city(),
        companies: [1]
    }

    it('POST - Criar um usuário com dados aleatórios', () => {
        cy.request({
            method: 'POST',
            url: '/api/user/create',
            failOnStatusCode: false,
            body: userData
        }).then((response) => {

            if (response.body.id_user) {
                userId = response.body.id_user
                cy.log(`ID Capturado com sucesso: ${userId}`)
            }

            expect(response.body).to.have.property('id_user')
            expect(response.body.name).to.eq(userData.name)
            expect(response.status).to.eq(201)
        })
    })

    it('GET - Validar usuário criado', () => {
        if (!userId) throw new Error('ID não encontrado. O teste anterior falhou?')

        cy.request('GET', `/api/user/${userId}`).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.email).to.eq(userData.email)
        })
    })

    it('GET - Listar todos os usuários', () => {
        cy.request('GET', '/api/user').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
        })
    })

    it('PATCH - Editar apenas o campo NOME', () => {
        if (!userId) throw new Error('ID do usuário não encontrado.')

        const novoNome = `Editado ${faker.person.firstName()}`

        cy.request({
            method: 'PATCH',
            url: `/api/user/${userId}/update`,
            failOnStatusCode: false,
            body: {
                "name": novoNome
            }
        }).then((response) => {

            if (response.status === 500) {
                cy.log('🚨 BUG ENCONTRADO: API retorna 500 ao tentar atualização parcial (PATCH).')
                cy.log('Payload enviado:', JSON.stringify({ "name": novoNome }))
            }

            expect(response.status).to.eq(200, 'Bug Crítico: O endpoint PATCH deveria aceitar payload parcial, mas retornou erro.')

            if (response.status === 200) {
                expect(response.body.name).to.eq(novoNome)
            }
        })
    })

})

context('Validações de Campos Obrigatórios', () => {

    const gerarUsuarioValido = () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        telephone: faker.string.numeric(11),
        birth_date: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
        birth_city: faker.location.city(),
        companies: [1]
    })

    const validarQueNaoCriou = (response, campoTestado) => {

        if (response.body.id_user || response.body.id) {

            throw new Error(`BUG CRÍTICO: O sistema criou um usuário sem ${campoTestado}! ID gerado: ${response.body.id_user || response.body.id}`)
        }

        if (response.status === 201 || response.status === 200) {
            throw new Error(`FALHA: A API retornou Sucesso (${response.status}) para um cadastro sem ${campoTestado}.`)
        }

        cy.log(`Sucesso: O sistema recusou o cadastro sem ${campoTestado} corretamente.`)
    }

    it('Validação: campo obrigatório Nome', () => {
        const payload = gerarUsuarioValido()
        delete payload.name 

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((res) => validarQueNaoCriou(res, 'NOME'))
    })

    it('Validação: campo obrigatório EMAIL', () => {
        const payload = gerarUsuarioValido()
        delete payload.email 

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((res) => validarQueNaoCriou(res, 'EMAIL'))
    })

    it('Validação: campo obrigatório TELEFONE', () => {
        const payload = gerarUsuarioValido()
        delete payload.telephone 

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((res) => validarQueNaoCriou(res, 'TELEFONE'))
    })

    it('Validação: campo obrigatório DATA DE NASCIMENTO', () => {
        const payload = gerarUsuarioValido()
        delete payload.birth_date 

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((res) => validarQueNaoCriou(res, 'DATA DE NASCIMENTO'))
    })

    it('Validação: campo obrigatório CIDADE', () => {
        const payload = gerarUsuarioValido()
        delete payload.birth_city 

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((res) => validarQueNaoCriou(res, 'CIDADE DE NASCIMENTO'))
    })

    it('Validação: caampo obrigatório EMPRESA', () => {
        const payload = gerarUsuarioValido()
        delete payload.companies 

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((res) => validarQueNaoCriou(res, 'EMPRESA'))
    })
})


context('Validação de Duplicidade', () => {

    let usuarioOriginal;

    it('Criar usuário "Original" para conflito', () => {

        usuarioOriginal = {
            name: `Original ${faker.person.firstName()}`,
            email: faker.internet.email(),
            telephone: faker.string.numeric(11),
            birth_date: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
            birth_city: faker.location.city(),
            companies: [1]
        }

        cy.request({
            method: 'POST',
            url: '/api/user/create',
            failOnStatusCode: false,
            body: usuarioOriginal
        }).then((response) => {
            expect(response.status).to.be.oneOf([200, 201])
            cy.log(`Usuário Original criado: ${usuarioOriginal.email}`)
        })
    })

    it('Não deve permitir cadastro com EMAIL duplicado', () => {
        const payloadDuplicado = {
            ...usuarioOriginal,
            name: "Tentativa Clone Email", 
            telephone: faker.string.numeric(11) 
        }

        cy.request({
            method: 'POST',
            url: '/api/user/create',
            failOnStatusCode: false,
            body: payloadDuplicado
        }).then((response) => {

            if (response.status === 200 || response.status === 201) {

                if (response.body.id_user || response.body.id) {
                    throw new Error(`BUG DE DUPLICIDADE: O sistema permitiu cadastrar dois usuários com o email ${usuarioOriginal.email}! ID Gerado: ${response.body.id_user || response.body.id}`)
                }
            }

            if (response.status === 500) {
                cy.log('⚠️ ALERTA: O sistema deu erro 500 ao tentar duplicar. O ideal seria 409 ou 400, mas pelo menos não criou.')
            } else {
                expect(response.status).to.be.oneOf([400, 409, 422])
            }
        })
    })

    it('Não deve permitir cadastro com TELEFONE duplicado', () => {

        const payloadDuplicado = {
            ...usuarioOriginal,
            name: "Tentativa Clone Telefone",
            email: faker.internet.email()
        }

        cy.request({
            method: 'POST',
            url: '/api/user/create',
            failOnStatusCode: false,
            body: payloadDuplicado
        }).then((response) => {

            if (response.status === 200 || response.status === 201) {
                if (response.body.id_user || response.body.id) {
                    throw new Error(`BUG DE DUPLICIDADE: O sistema permitiu cadastrar dois usuários com o telefone ${usuarioOriginal.telephone}!`)
                }
            }

            if (response.status === 500) {
                cy.log('⚠️ ALERTA: Erro 500 ao validar telefone duplicado.')
            } else {
                expect(response.status).to.be.oneOf([400, 409, 422])
            }
        })
    })
})


context('Validação de Formatos e Tipos de Dados', () => {

    const gerarBase = () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        telephone: faker.string.numeric(11),
        birth_date: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
        birth_city: faker.location.city(),
        companies: [1]
    })

    it('Não deve permitir EMAIL inválido (sem @ ou domínio)', () => {
        const payload = gerarBase()
        payload.email = "email-sem-arroba.com"

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((response) => {

            if (response.status === 200 || response.status === 201) {
                throw new Error(`BUG: API aceitou email inválido '${payload.email}'! ID Criado: ${response.body.id_user || response.body.id}`)
            }
            expect(response.status).to.be.oneOf([400, 422])
        })
    })

    it('Não deve permitir TELEFONE com letras', () => {
        const payload = gerarBase()
        payload.telephone = "abcde-erro"

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((response) => {

            if (response.status === 200 || response.status === 201) {
                throw new Error(`BUG: API aceitou telefone com letras '${payload.telephone}'! ID Criado: ${response.body.id_user || response.body.id}`)
            }

            expect(response.status).to.be.oneOf([400, 422])
        })
    })

    it('Não deve permitir DATA DE NASCIMENTO futura', () => {
        const payload = gerarBase()
        const dataFutura = faker.date.future({ years: 1 }).toISOString().split('T')[0]
        payload.birth_date = dataFutura 

        cy.request({
            method: 'POST', url: '/api/user/create', failOnStatusCode: false,
            body: payload
        }).then((response) => {

            if (response.status === 200 || response.status === 201) {
                throw new Error(`BUG: API aceitou data de nascimento futura '${dataFutura}'! ID Criado: ${response.body.id_user || response.body.id}`)
            }

            expect(response.status).to.be.oneOf([400, 422])
        })
    })
})

context('DELETE - Exclusão de Usuário', () => {

    let idParaDeletar;

    before(() => {
        const usuarioDescartavel = {
            name: `User Delete ${faker.person.firstName()}`,
            email: faker.internet.email(),
            telephone: "51999999999", 
            birth_date: "1990-01-01",
            birth_city: "Cidade Delete",
            companies: [1]
        }

        cy.request({
            method: 'POST',
            url: '/api/user/create',
            failOnStatusCode: false, 
            body: usuarioDescartavel
        }).then((response) => {

            idParaDeletar = response.body.id_user || response.body.id
            cy.log(`Usuário criado para deleção: ID ${idParaDeletar}`)
        })
    })

    it('Deve deletar um usuário existente com sucesso', () => {

        if (!idParaDeletar) throw new Error("O usuário de teste não foi criado, impossível deletar.")

        cy.request({
            method: 'DELETE',
            url: `/api/user/${idParaDeletar}/delete`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(200, 'A API deveria retornar 200 ao deletar com sucesso.')

            if (response.body.message) {
                cy.log(`Mensagem da API: ${response.body.message}`)
            }
        })
    })

    it('Deve tratar a exclusão de usuário INEXISTENTE', () => {
        const idInexistente = 999999999

        cy.request({
            method: 'DELETE',
            url: `/api/user/${idInexistente}/delete`,
            failOnStatusCode: false 
        }).then((response) => {

            if (response.status === 200) {
                cy.log('⚠️ ALERTA: A API retornou 200 (Sucesso) ao tentar deletar um ID inexistente. Deveria ser 400 ou 404.')
            }

            expect(response.status).to.be.oneOf([400, 404, 500])
        })
    })

    it('Validação Dupla: Verificar se o usuário foi realmente removido', () => {
        if (!idParaDeletar) return

        cy.request({
            method: 'GET',
            url: `/api/user/${idParaDeletar}`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.not.eq(200, 'Erro Crítico: O usuário foi deletado mas ainda retorna no GET!')
        })
    })
})